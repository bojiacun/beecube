import {Component, PropsWithChildren} from 'react'
import {Provider} from 'react-redux';
import "windi.css";
import './app.scss';
import configStore from "./store";
import {setPageLoading, setSiteInfo, setSystemInfo} from "./store/actions";
import Taro from "@tarojs/taro";

const QQMapWX = require('./lib/qqmap-wx-jssdk.min');
const store = configStore();

class App extends Component<PropsWithChildren> {

  componentDidMount() {
    store.dispatch(setPageLoading(true));
    const siteInfo = require('./siteinfo');
    store.dispatch(setSiteInfo(siteInfo));
    store.dispatch(setSystemInfo(Taro.getSystemInfoSync()));
    console.log(store.getState());
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
