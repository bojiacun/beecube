// api.js
import axios from "taro-axios";
import Taro from "@tarojs/taro";
import utils from "./utils";

const siteinfo = require('../siteinfo');
const API_URL = siteinfo.siteroot;

const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {'X-App-Id': siteinfo.appId},
});

const handleOnResponseError = async (error: any) => {
    if (!error.status) {
        Taro.showToast({icon: 'none', title: '网络请求发生错误!', duration: 1500}).then();
        return Promise.reject(error);
    }
    else if(error.status == 401){
        //登录超时，或者是未登录，重新执行登录流程
    }
    utils.hideLoading();
}

instance.interceptors.request.use((request)=>{
    const token = Taro.getStorageSync("TOKEN");
    if(token) {
        request.headers['X-Access-Token'] = token;
        request.headers['Authorization'] = token;
    }
    return request;
}, (error)=>{
    console.log('request error',error);
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    utils.hideLoading();
    return response;
}, async (error) => {
    console.log('response error',error);
    return await handleOnResponseError(error);
});

export default instance;
