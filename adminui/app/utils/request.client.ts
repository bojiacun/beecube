import axios from "axios";
//@ts-ignore
export const BASE_URL =  window.ENV.BASE_URL || 'http://localhost:3000';

const instance = axios.create({
    baseURL: BASE_URL,
});
instance.defaults.headers['Content-Type'] = 'application/json';

export default instance;