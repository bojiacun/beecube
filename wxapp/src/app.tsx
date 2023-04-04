import {Component, PropsWithChildren} from 'react'
import {Provider} from 'react-redux';
import "windi.css";
import './app.scss';
import configStore from "./store";
import {setContext, setMessage, setPageLoading, setSiteInfo, setSystemInfo} from "./store/actions";
import Taro from "@tarojs/taro";
import request, {connectWebSocketServer} from './lib/request';
import 'weapp-cookie';
import zg from './lib/zego';

const QQMapWX = require('./lib/qqmap-wx-jssdk.min');
const siteInfo = Taro.getExtConfigSync();
const store = configStore();
let qqmapSdk;

class App extends Component<PropsWithChildren> {

    socket: any;
    checkTimer: any;
    checkTimeout:number = 30000;

    constructor(props) {
        super(props);
        this.initUser = this.initUser.bind(this);
        this.onMessageReceive = this.onMessageReceive.bind(this);
        this.onSocketError = this.onSocketError.bind(this);
        this.onSocketClose = this.onSocketClose.bind(this);
        this.connectToServer = this.connectToServer.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    initUser(context) {
        request.get('/app/api/members/profile').then(res => {
            context.userInfo = res.data.result;
            store.dispatch(setContext(context));
            this.connectToServer(context);
            this.initZego(context);
        });
    }
    initZego(context) {
        const settings = context.settings;
        const userInfo = context.userInfo;
        const appId = parseInt(settings.zegoAppId);
        if(appId) {
            zg.config({
                appid: appId,
                server: settings.zegoServerAddress,
                idName: userInfo.id,
                nickName: userInfo.nickname,
                logLevel: 0,
                remoteLogLevel: 0,
                logUrl: settings.zegoLogUrl,
                audienceCreateRoom: false
            });
        }
    }
    connectToServer(context) {
        if(siteInfo?.appId && context.userInfo?.id) {
            connectWebSocketServer('/auction/websocket/' + siteInfo.appId + '/' + context.userInfo.id).then(res => {
                this.socket = res;
                this.socket.onMessage(this.onMessageReceive);
                this.socket.onClose(this.onSocketClose);
                this.socket.onError(this.onSocketError);
                this.healthCheck(this.socket);
            });
        }
    }
    onSocketError(error) {
        console.log('发生错误，服务器连接断开,5秒后尝试重连', error);
    }
    onSocketClose(res) {
        console.log('服务器连接断开, 5秒后尝试重连', res);
        clearInterval(this.checkTimer);
        let {context} = store.getState();
        setTimeout(()=>{
            this.connectToServer(context);
        }, 5000);
    }
    healthCheck(socket) {
        this.checkTimer = setInterval(()=>{
            let {context} = store.getState();
            let data = {type: 'MSG_HEALTH', fromUserId: context.userInfo?.id};
            console.log('发送心跳包', data);
            socket.send({data: JSON.stringify(data)});
        }, this.checkTimeout);
    }

    onMessageReceive(message:any) {
        message = JSON.parse(message.data);
        console.log('received a message', message);
        if(message.type === 'MSG_REPLY') {
            console.log('收到心跳包', message);
            return;
        }
        store.dispatch(setMessage(message));
    }

    componentDidMount() {
        store.dispatch(setPageLoading(false));
        store.dispatch(setSiteInfo(siteInfo));
        store.dispatch(setSystemInfo(Taro.getSystemInfoSync()));
    }

    onLaunch(options) {
        let {context} = store.getState();
        console.log('App的SiteInfo为', siteInfo);
        context.referer = options;
        context.copyright = siteInfo.copyright;
        Promise.all([request.get('/app/api/settings/all'), request.get('/app/api/navs/all'), request.get('/paimai/api/settings')]).then(reses => {
            let settings = reses[0].data.result;
            let dist = {};
            settings.forEach(item => dist[item.settingKey] = item.settingValue);
            let settingsPaimai = reses[2].data.result;
            settingsPaimai.forEach(item => dist[item.descKey] = item.descValue);
            context.settings = dist;
            context.tabs = reses[1].data.result;
            store.dispatch(setContext(context));
            store.dispatch(setPageLoading(false));

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
                let mid = options?.query?.mid || '';
                Taro.login().then(res => {
                    request.get('/app/api/wxapp/login', {params: {code: res.code, mid: mid}}).then(res => {
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
