import axios from "axios";

export const BASE_URL = 'http://localhost:9999';
export const API_LOGIN = `${BASE_URL}/jeecg-system/sys/login`;
export const API_CAPTCHA = `${BASE_URL}/jeecg-system/sys/randomImage`;

export const LOGIN_SUCCESS_URL = '/';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const postFormInit = (data: any): RequestInit=> {
    return {method: 'post', body: data, headers: {'Content-Type': 'application/json'}};
}



export const LOCAL_USER_KEY = 'USER_INFO';