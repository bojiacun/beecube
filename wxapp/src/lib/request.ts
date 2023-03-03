// api.js
import axios, {AxiosResponse} from "taro-axios";
import Taro from "@tarojs/taro";
import utils from "./utils";

const siteinfo = require('../siteinfo');
export const API_URL = siteinfo.siteroot;
export const APP_ID = siteinfo.appId;

const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {'X-App-Id': siteinfo.appId},
});

const handleOnResponse = async (response: AxiosResponse) => {
    let res = response.data;
    if(res.code == 401) {
        //登录态失效，重新执行登录
        const res:any = await Taro.login();
        const result:any = await instance.get('/app/api/wxapp/login', {params: {code: res.code}});
        const token = result.data.result;
        Taro.setStorageSync("TOKEN", token);
        //重新发起请求
        response.config.headers['X-Access-Token'] = token;
        response.config.headers['Authorization'] = token;
        return await instance.request(response.config);
    }
    else if(res.code == 403) {
        Taro.showToast({icon: 'none', title: '无权限访问!', duration: 1500}).then();
        return Promise.reject(new Error("无权限访问"));
    }
    else if(res.code == 500) {
        Taro.showToast({icon: 'none', title: res.message || '服务器发生错误', duration: 1500}).then();
        return response;
    }
    return response;
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

instance.interceptors.response.use(async (response) => {
    return await handleOnResponse(response);
}, async (error) => {
    Taro.showToast({icon: 'none', title: '网络错误!', duration: 1500}).then();
    return Promise.reject(error);
});

export async function connectWebSocketServer(url: string) {
    const token = Taro.getStorageSync("TOKEN");
    let res:any;
    try {
        res = await Taro.connectSocket({url: API_URL.replace('https', 'wss')+'/'+url, header: {
                "X-App-Id": APP_ID,
                "X-Access-Token": token,
                "Authorization": token,
            }});
    }
    catch (e) {
        console.log('websocket连接失败',e);
        utils.showMessage("消息功能加载失败,无法及时刷新出价信息").then();
    }
    return res;
}

export default instance;
