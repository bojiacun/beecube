import { Component, PropsWithChildren } from 'react'
import "windi.css";
import './app.scss';
import configStore from "./store";
const QQMapWX = require('./lib/qqmap-wx-jssdk.min');
const store = configStore();

class App extends Component<PropsWithChildren> {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App
