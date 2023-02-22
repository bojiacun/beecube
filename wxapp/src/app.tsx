import {Component, PropsWithChildren} from 'react'
import {Provider} from 'react-redux';
import "windi.css";
import './app.scss';
import configStore from "./store";
import {setContext, setGeo, setPageLoading, setPosition, setSiteInfo, setSystemInfo} from "./store/actions";
import Taro from "@tarojs/taro";
import request from './lib/request';

const QQMapWX = require('./lib/qqmap-wx-jssdk.min');
const store = configStore();
let qqmapSdk;
class App extends Component<PropsWithChildren> {

  componentDidMount() {
    store.dispatch(setPageLoading(true));
    const siteInfo = require('./siteinfo');
    store.dispatch(setSiteInfo(siteInfo));
    store.dispatch(setSystemInfo(Taro.getSystemInfoSync()));
  }

  onLaunch(options) {
    let {context} = store.getState();
    context.referer = options;
    Promise.all([request.get('/app/api/settings/all'), request.get('/app/api/navs/all')]).then(reses=>{
      let settings = reses[0].data.result;
      let dist = {};
      settings.forEach(item=>dist[item.settingKey] = item.settingValue);
      context.settings = dist;
      context.tabs = reses[1].data.result;
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
