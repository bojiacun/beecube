import {LoginedUser, requireAuthenticated} from "~/utils/auth.server";
import {RequestInfo} from "@remix-run/node";

export const BASE_URL =  process.env.BASE_URL || 'http://localhost:9999';
export const LOGIN_SUCCESS_URL =  process.env.LOGIN_SUCCESS_URL || '/';
export const LOGIN_URL = process.env.LOGIN_URL || '/login';
export const LOGOUT_URL = process.env.LOGOUT_URL || '/auth/logout';
export const USER_INFO_URL = process.env.USER_INFO_URL || '/auth/user';
export const API_LOGIN = `${BASE_URL}/jeecg-system/sys/login`;
export const API_CAPTCHA = `${BASE_URL}/jeecg-system/sys/randomImage`;
export const API_ROLE_LIST = `${BASE_URL}/jeecg-system/sys/role/list`;

export const postFormInit = (data: any): RequestInit=> {
    return {method: 'post', body: data, headers: {'Content-Type': 'application/json'}};
}

export const request = async (request: Request) => async (url:RequestInfo, options:any) => {
    const user: LoginedUser = await requireAuthenticated(request);
    options.headers['X-Access-Token'] = user.token;
    options.headers['Authorization'] = user.token;
    return fetch(url, options);
}