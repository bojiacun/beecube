// api.js
import axios from "taro-axios";
import Taro from "@tarojs/taro";

const siteinfo = require('../siteinfo');
const API_URL = siteinfo.siteroot;

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
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
