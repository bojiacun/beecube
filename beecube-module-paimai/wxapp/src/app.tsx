import {Component, PropsWithChildren} from 'react'
import {Provider} from 'react-redux';
import "windi.css";
import './app.scss';
import configStore from "./store";
import {setContext, setPageLoading, setSiteInfo, setSystemInfo} from "./store/actions";
import Taro from "@tarojs/taro";
import request from './lib/request';
import IMManager from './utils/im-manager';
import EventBus from './utils/event-bus';
import EventType from './utils/event-type';
import 'weapp-cookie';
import utils from "./lib/utils";

const QQMapWX = require('./lib/qqmap-wx-jssdk.min');
const siteInfo = Taro.getExtConfigSync();
const store = configStore();
// const IM_SERVER_URL = "wss://im.winkt.cn/websocket";
const IM_SERVER_URL = "ws://localhost:3000/websocket";
let qqmapSdk;

class App extends Component<PropsWithChildren> {
    options: any;
    constructor(props) {
        super(props);
        this.initUser = this.initUser.bind(this);
        this.onMessageReceive = this.onMessageReceive.bind(this);
        this.registerIMEvents = this.registerIMEvents.bind(this);
    }

    initUser(context) {
        request.get('/app/api/members/profile').then(res => {
            context.userInfo = res.data.result;
            store.dispatch(setContext(context));
            this.registerIMEvents(context);
            this.initIM(context);
        });
    }
    initIM(context) {
        const userInfo = context.userInfo;
        const app = Taro.getApp();
        app.imManager = new IMManager(app);
        app.imManager.IM_SERVER_URL = IM_SERVER_URL;
        if(userInfo?.id) {
            wx.IMSDK.loginImpl({
                loginUserId: userInfo.id,
                loginToken: Taro.getStorageSync("TOKEN"),
                extra: JSON.stringify({appId: siteInfo.appId, loginType: 1})
            }, app.imManager.IM_SERVER_URL);
        }
        app.globalData = {userInfo: userInfo};
    }

    registerIMEvents(context){
        // 提示：ES6的箭头函数中this指向的是外部调用者，而function()这种匿名函数则是指向它自身，别理解错

        // 注册应用层事件通知：事件发生于收到聊天消息时，此处接收通知并在UI上展现出来
        EventBus.register(EventType.onIMData, (p) => {
            // 是否“我”发出的消息
            console.log('收到服务器发来的消息', p);
            let isme = (p.from == wx.IMSDK.getLoginInfo().loginUserId);
            let message = JSON.parse(p.dataContent);
            message.isme = isme;
            message.type = parseInt(p.typeu);
            message.id = p.fp;
            this.onMessageReceive(message);
        })

        // 注册应用层事件通知：事件发生于客户端成功登陆/认证后，此处接收通知并在UI上展开相关逻辑
        EventBus.register(EventType.onIMAfterLoginSucess, () => {
            // 设置已成功登录标识并通知ui刷新
            console.log(wx.IMSDK.getLoginInfo().loginUserId+'用户登录成功');
            context.isImReady = true;
            store.dispatch(setContext(context));
        });

        // 注册应用层事件通知：事件发生于客户端登陆/认证失败后（可能是被禁、token/密码被重置等，具体由服务端决定）
        EventBus.register(EventType.onIMAfterLoginFailed, (isReconnect) => {
            console.log('对不起，你' + (isReconnect ? '自动重连' : '登陆') + 'IM服务器失败了 ...', false);
        });

        // 注册应用层事件通知：事件发生于客户端与服务器的网络断开后
        EventBus.register(EventType.onIMDisconnected, () => {
            console.log('Sorry，你掉线了 ...', false);
        });

        // 注册应用层事件通知：事件发生于客户端掉线重连成功后
        EventBus.register(EventType.onIMReconnectSucess, () => {
            console.log('掉线自动重连成功了!', false);
        });

        // 注册应用层事件通知：事件发生于客户端收到服务端的心跳响应包，此事件对于应用层无实质性意义，一般无需理会
        EventBus.register(EventType.onIMPong, () => {
            // 绿色呼吸灯效果（表示心跳在后面正常工作中...）
        });

        // 注册应用层事件通知：事件发生于聊天消息/指令未成功送达时，此处接收通知可在UI界面上标记未送出的消息
        EventBus.register(EventType.onMessagesLost, (lostMessages) => {
            console.log('消息发送失败', lostMessages);
            utils.showError('发送消息失败');
        });

        // 注册应用层事件通知：事件发生于聊天消息/指令已被对方收到，此处接收通知可在UI界面上标记已送达的消息
        EventBus.register(EventType.onMessagesBeReceived, (theFingerPrint) => {
            console.log("[DEMO-UI] [收到消息应答]fp=" + theFingerPrint, true);
        });
    }

    onMessageReceive(message:any) {
        // store.dispatch(setMessage(message));
        EventBus.post(EventType.onMessageData, message);
    }

    componentDidMount() {
        console.log('component did mount');
    }

    initApp(options) {
        console.log('开始初始化程序');
        store.dispatch(setPageLoading(true));
        store.dispatch(setSiteInfo(siteInfo));
        store.dispatch(setSystemInfo(Taro.getSystemInfoSync()));
        let {context} = store.getState();
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

    onLaunch(options) {
        console.log('on load executed', options);
        store.dispatch(setPageLoading(true));
        this.options = options;
    }

    componentDidShow() {
        console.log('on show executed', this.options);
        //确保初始化会执行
        let {context} = store.getState();
        if(!context.userInfo) {
            this.initApp(this.options);
        }
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
