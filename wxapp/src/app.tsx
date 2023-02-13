import { Component } from 'react'
import Taro from '@tarojs/taro';
import { Provider } from 'react-redux';
import './app.scss'
import configStore from './store';
import { setContext, setGeo, setPageLoading, setPosition, setTabs } from './store/actions';
import { KEY_USERINFO } from "./utils/we7/util";
import request, {
    API_MEMBER_INFO,
    API_SYSTEM_SETTINGS,
    API_TABBARS,
    SERVICE_WINKT_COMMON_HEADER, SERVICE_WINKT_MEMBER_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER
} from "./utils/request";
import context from "./utils/context";
import 'weapp-cookie';
import { refreshMemberInfo } from './global';
const QQMapWX = require('./utils/qqmap-wx-jssdk.min');


const store = configStore();
let qqmapSdk;
class App extends Component {

    componentDidMount() {
        store.dispatch(setPageLoading(true));
        context.siteInfo = require('./siteinfo.js');
        context.systemInfo = Taro.getSystemInfoSync();
        context.navBarHeight = 44;
        console.log('app mounted');
    }

    onLaunch(options) {
        context.referer = options;
        Promise.all([request.get(API_SYSTEM_SETTINGS, SERVICE_WINKT_COMMON_HEADER), request.get(API_TABBARS, SERVICE_WINKT_SYSTEM_HEADER)]).then((reses: any) => {
            store.dispatch(setTabs(reses[1].data.data || []));
            let settings = reses[0].data.data;
            let dist = {};
            settings.forEach(item => dist[item.key] = item.value);
            context.settings = dist;
            let userInfo = Taro.getStorageSync(KEY_USERINFO) || null;
            if (userInfo) {
                //检测是否需要手机号登录
                if (context.settings && context.settings.requireMobile == 'true' && !userInfo.memberInfo.mobile) {
                    //需要手机号登录，但是没有手机号，则自动退出登录
                    Taro.removeStorageSync(KEY_USERINFO);
                }
                else {
                    context.userInfo = userInfo;
                }
            }
            //设置字体颜色
            store.dispatch(setContext(context));
            store.dispatch(setPageLoading(false));

            const mapKey = context.settings.tencentMapKey;
            qqmapSdk = new QQMapWX({ key: mapKey });
            Taro.onLocationChange(res => {
                console.log('location changed', res);
                store.dispatch(setPosition({ lat: res.latitude, lng: res.longitude }));
                qqmapSdk.reverseGeocoder({
                    location: res,
                    success(res) {
                        Taro.stopLocationUpdate({
                            success(res) {
                                console.log('stop location update', res);
                            }
                        });
                        store.dispatch(setGeo(res.result));
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
        console.log('app launched', context);
    }

    componentDidShow() {
        if (qqmapSdk) {
            Taro.startLocationUpdate({
                success(res) {
                    console.log('start location change listening', res);
                }
            });
        }
        //全局刷新当前会员信息
        if(context.userInfo?.memberInfo) {
            request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
                console.log('refresh member info when app show');
                refreshMemberInfo(res.data.data);
            })
        }
    }

    componentDidHide() {
        Taro.stopLocationUpdate({
            success(res) {
                console.log('stop location update', res);
            }
        });
    }

    componentWillUnmount() {
    }

    componentDidCatchError() {
    }

    // this.props.children 是将要会渲染的页面
    render() {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        )
    }
}


export default App
