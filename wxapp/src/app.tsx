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
const store = configStore();
let qqmapSdk;

class App extends Component<PropsWithChildren> {

    socket: any;

    constructor(props) {
        super(props);
        this.initUser = this.initUser.bind(this);
        this.onMessageReceive = this.onMessageReceive.bind(this);
    }

    initUser(context) {
        request.get('/app/api/members/profile').then(res => {
            context.userInfo = res.data.result;
            store.dispatch(setContext(context));
            store.dispatch(setPageLoading(false));
            connectWebSocketServer('/auction/websocket/' + context.userInfo.id).then(res => {
                this.socket = res;
                this.socket.onMessage(this.onMessageReceive);
                console.log('websocket linked', '/auction/websocket/' + context.userInfo.id);
            });
        });
    }

    onMessageReceive(message:any) {
        message = JSON.parse(message.data);
        console.log('received a message', message);
        store.dispatch(setMessage(message));
    }

    componentDidMount() {
        store.dispatch(setPageLoading(true));
        const siteInfo = require('./siteinfo');
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
                Taro.setStorageSync("POSITION", {lat: res.latitude, lng: res.longitude});
                qqmapSdk.reverseGeocoder({
                    location: res,
                    success(res) {
                        Taro.stopLocationUpdate({
                            success(res) {
                                console.log('stop location update', res);
                            }
                        });
                        Taro.setStorageSync("GEO", res.result);
                    },
                    fail(err) {
                        console.error('reverse geocoder fail', err);
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
        if (qqmapSdk) {
            Taro.startLocationUpdate({
                success(res) {
                    console.log('start location change listening', res);
                }
            });
        }
    }

    componentDidHide() {
        Taro.stopLocationUpdate({
            success(res) {
                console.log('stop location update', res);
            }
        });
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
