import {Component, PropsWithChildren} from 'react'
import {Provider} from 'react-redux';
import "windi.css";
import './app.scss';
import configStore from "./store";
import {setContext, setPageLoading, setSiteInfo, setSystemInfo} from "./store/actions";
import Taro from "@tarojs/taro";
import request from './lib/request';

const QQMapWX = require('./lib/qqmap-wx-jssdk.min');
const store = configStore();

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
      console.log(reses);
      let settings = reses[0].data.result;
      let dist = {};
      settings.forEach(item=>dist[item.settingKey] = item.settingValue);
      context.settings = dist;
      context.tabs = reses[1].data.result;
      store.dispatch(setContext(context));
      store.dispatch(setPageLoading(false));
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
