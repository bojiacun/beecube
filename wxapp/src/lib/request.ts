// api.js
import axios from "axios";
import { TaroAdapter } from "axios-taro-adapter";
import Taro from "@tarojs/taro";

const siteinfo = require('../siteinfo');
const API_URL = siteinfo.siteroot;

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  adapter: TaroAdapter, // add this line，添加这一行使用taroAdapter
  headers: {'X-App-Id': siteinfo.appId},
});

const hanldeOnResponseError = (error:any) => {
  if(!error.status) {
    return Taro.showToast({icon: 'none', title: '网络请求发生错误!', duration: 1500}).then();
  }
}

instance.interceptors.response.use((response)=>{
  return response;
}, (error)=>{
  // console.log(error);
  hanldeOnResponseError(error);
  return Promise.reject(error);
});

export default instance;
