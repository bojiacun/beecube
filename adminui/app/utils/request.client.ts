import axios from "axios";

//@ts-ignore
export const BASE_URL =  window.ENV.BASE_URL || 'http://localhost:9999';
export const API_CAPTCHA_URL = `/jeecg-system/sys/randomImage`;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';