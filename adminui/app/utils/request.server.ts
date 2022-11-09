
export const BASE_URL =  process.env.BASE_URL || 'http://localhost:9999';
export const LOGIN_SUCCESS_URL =  process.env.LOGIN_SUCESS_URL || '/';
export const LOCAL_USER_KEY = process.env.LOCAL_USER_KEY || 'USER_INFO';

export const API_LOGIN = `${BASE_URL}/jeecg-system/sys/login`;
export const API_CAPTCHA = `${BASE_URL}/jeecg-system/sys/randomImage`;
export const API_ROLE_LIST = `${BASE_URL}/jeecg-system/sys/role/list`;

export const postFormInit = (data: any): RequestInit=> {
    return {method: 'post', body: data, headers: {'Content-Type': 'application/json'}};
}