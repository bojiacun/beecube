import axios from "axios";
import ServerEnv from "~/env";
//@ts-ignore
export const BASE_URL =  ServerEnv.AXIOS_BASE_URL || 'http://localhost:3000';

const instance = axios.create({
    baseURL: BASE_URL,
});
instance.defaults.headers['Content-Type'] = 'application/json';
instance.defaults.withCredentials = true;

export default instance;