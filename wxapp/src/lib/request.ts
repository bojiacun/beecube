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

const handleOnResponseError = (error: any) => {
    if (!error.status) {
        return Taro.showToast({icon: 'none', title: '网络请求发生错误!', duration: 1500}).then();
    }
    else {
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
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    utils.hideLoading();
    return response;
}, (error) => {
    handleOnResponseError(error);
    return Promise.reject(error);
});

export default instance;
