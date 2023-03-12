import {Component, PropsWithChildren} from 'react'
import {Provider} from 'react-redux';
import "windi.css";
import './app.scss';
import configStore from "./store";
import {setContext, setMessage, setPageLoading, setSiteInfo, setSystemInfo} from "./store/actions";
import Taro from "@tarojs/taro";
import request, {connectWebSocketServer} from './lib/request';
import 'weapp-cookie';

const QQMapWX = require('./lib/qqmap-wx-jssdk.min');
const siteInfo = require('./siteinfo');
const store = configStore();
let qqmapSdk;

class App extends Component<PropsWithChildren> {

    socket: any;

    constructor(props) {
        super(props);
        this.initUser = this.initUser.bind(this);
        this.onMessageReceive = this.onMessageReceive.bind(this);
        this.onSocketError = this.onSocketError.bind(this);
        this.onSocketClose = this.onSocketClose.bind(this);
        this.connectToServer = this.connectToServer.bind(this);
    }

    initUser(context) {
        request.get('/app/api/members/profile').then(res => {
            context.userInfo = res.data.result;
            store.dispatch(setContext(context));
            store.dispatch(setPageLoading(false));
            this.connectToServer(context);
        });
    }
    connectToServer(context) {
        connectWebSocketServer('/auction/websocket/' + siteInfo.appId +'/'+context.userInfo.id).then(res => {
            this.socket = res;
            this.socket.onMessage(this.onMessageReceive);
            this.socket.onClose(this.onSocketClose);
            this.socket.onError(this.onSocketError);
        });
    }
    onSocketError(error) {
        let {context} = store.getState();
        console.log('服务器连接断开,5秒后尝试重连', error);
        setTimeout(()=>{
            this.connectToServer(context);
        }, 5000);
    }
    onSocketClose() {
        console.log('服务器连接断开,立即尝试重连');
        let {context} = store.getState();
        this.connectToServer(context);
    }

    onMessageReceive(message:any) {
        message = JSON.parse(message.data);
        console.log('received a message', message);
        store.dispatch(setMessage(message));
    }

    componentDidMount() {
        store.dispatch(setPageLoading(true));
        store.dispatch(setSiteInfo(siteInfo));
        store.dispatch(setSystemInfo(Taro.getSystemInfoSync()));
    }

    onLaunch(options) {
        let {context} = store.getState();
        context.referer = options;
        Promise.all([request.get('/app/api/settings/all'), request.get('/app/api/navs/all')]).then(reses => {
            let settings = reses[0].data.result;
            let dist = {};
            settings.forEach(item => dist[item.settingKey] = item.settingValue);
            context.settings = dist;
            context.tabs = reses[1].data.result;
            let position = Taro.getStorageSync("POSITION");
            if (position) {
                context.position = position;
            }
            let geo = Taro.getStorageSync("GEO");
            if (geo) {
                context.province = geo.address_component.province;
                context.city = geo.address_component.city;
                context.district = geo.address_component.district;
            }

            const token = Taro.getStorageSync("TOKEN");
            //本地未存储token则执行登录操作
            if (!token) {
                Taro.login().then(res => {
                    request.get('/app/api/wxapp/login', {params: {code: res.code}}).then(res => {
                        Taro.setStorageSync("TOKEN", res.data.result);
                        this.initUser(context);
                    });
                })
            } else {
                this.initUser(context);
            }


            const mapKey = context.settings.tencentMapKey;
            qqmapSdk = new QQMapWX({key: mapKey});
            Taro.onLocationChange(res => {
                console.log('location changed', res);
                Taro.stopLocationUpdate();
                Taro.setStorageSync("POSITION", {lat: res.latitude, lng: res.longitude});
                qqmapSdk.reverseGeocoder({
                    location: res,
                    success(res) {
                        Taro.setStorageSync("GEO", res.result);
                    }
                });
            });
            Taro.startLocationUpdate({
                success(res) {
                    console.log('start location change listening', res);
                }
            });
        });


    }

    componentDidShow() {

    }

    componentDidHide() {

    }

    render() {
        // this.props.children 是将要会渲染的页面
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        )
    }
}

export default App
