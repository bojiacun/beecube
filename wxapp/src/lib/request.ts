// api.js
import axios from "axios";
import { TaroAdapter } from "axios-taro-adapter";

const siteinfo = require('../siteinfo');
const API_URL = siteinfo.siteroot;

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  adapter: TaroAdapter, // add this line，添加这一行使用taroAdapter
  headers: {'X-APP-ID': siteinfo.appId},
});


export default instance;
