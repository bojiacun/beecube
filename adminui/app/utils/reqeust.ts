import axios from "axios";

export const BASE_URL = 'http://localhost:9999';
export const LOGIN_SUCCESS_URL = '/';
export const LOCAL_USER_KEY = 'USER_INFO';

export const API_LOGIN = `${BASE_URL}/jeecg-system/sys/login`;
export const API_CAPTCHA = `${BASE_URL}/jeecg-system/sys/randomImage`;
export const API_ROLE_LIST = `${BASE_URL}/jeecg-system/sys/role/list`;


axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let axiosInstance:any = null;
export function getAxios() {
    if(axiosInstance == null) {
        configAxios();
    }
    return axiosInstance;
}

export function configAxios() {
    const user = getCurrentUser();
    if(user != null) {
        axios.defaults.headers.common['X-Access-Token'] = user.token;
        axios.defaults.headers.common['Authorization'] = user.token;
    }
    axiosInstance = axios.create();
}

export const postFormInit = (data: any): RequestInit=> {
    return {method: 'post', body: data, headers: {'Content-Type': 'application/json'}};
}
export const saveCurrentUser = (userInfo: any) => {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userInfo));
}
export function getCurrentUser() {
    if(localStorage.getItem(LOCAL_USER_KEY)) {
        return JSON.parse(localStorage.getItem(LOCAL_USER_KEY)!);
    }
    return null;
}