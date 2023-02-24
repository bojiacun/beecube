import {Component, PropsWithChildren} from "react";
import Taro from '@tarojs/taro';
import request from "../../lib/request";


export default class LoginView extends Component<PropsWithChildren, any> {
  componentDidMount() {
  }

  componentDidShow() {
    const token = Taro.getStorageSync("TOKEN");
    //本地未存储token则执行登录操作
    if(!token) {
      Taro.login().then(res=>{
        request.get('/app/api/wxapp/login', {params: {code: res.code}}).then(res=>{
          console.log(res.data.result);
        })
      })
    }
  }
}
