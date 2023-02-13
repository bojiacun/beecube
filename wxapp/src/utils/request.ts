import winktConfig from "../winkt.config";
import util from "./we7/util";


export const API_SYSTEM_SETTINGS = 'settings/system';
export const API_HOME_SWIPERS = 'wxapp/advertises?position=1';
export const API_HOME_ADVS = 'wxapp/advertises?position=3';
export const API_SITES = 'wxapp/sites';
export const API_ARTICLES = 'wxapp/articles';
export const API_ARTICLES_DETAIL = 'wxapp/articles/detail';
export const API_ARTICLE_CLASSES = 'wxapp/article/classes';
export const API_SITES_INFO = 'wxapp/sites';
export const API_SITES_NEW = 'wxapp/sites';
export const API_WASTES = 'wxapp/wastes/templates';
export const API_SITE_WASTES = 'wxapp/wastes/templates/sites';
export const API_SITE_NOTICES = 'wxapp/notices';
export const API_SITE_NOTICES_DETAIL = 'wxapp/notices/detail';
export const API_HOME_BANNERS = 'wxapp/advertises?position=2';
export const API_TABBARS = 'wxapp/menus?position=1';
export const API_DIY_PAGE = 'wxapp/diy';
export const API_CLASSES = 'wxapp/wastes/classes';
export const API_CLASSES_INDEX = 'wxapp/wastes/classes/index';
export const API_INDEX_MENUS = 'wxapp/menus?position=2';
export const API_VERIFY_CODE = 'vcode/send';
export const API_RECYCLERS_NEW = 'wxapp/recyclers';
export const API_RECYCLERS_GRADE = 'wxapp/orders/recycler/grades';
export const API_RECYCLERS_INFO = 'wxapp/recyclers/info';
export const API_RECYCLERS_STATISTICS = 'wxapp/recyclers/statistics';
export const API_RECYCLERS_CONFIRM_ORDER = 'wxapp/orders/peek';
export const API_RECYCLERS_CANCEL_ORDER = 'wxapp/recycler/orders/cancel';
export const API_RECYCLERS_REALCANCEL_ORDER = 'wxapp/recycler/orders/realcancel';
export const API_RECYCLERS_COMPLETE_ORDER = 'wxapp/orders/complete';
export const API_RECYCLERS_TOGGLE_SLEEP = 'wxapp/recyclers/sleep';
export const API_RECYCLERS_QRCODE = 'wxapp/recyclers/qrcodes';
export const API_RECYCLERS_PROXY_ORDER = 'wxapp/recycler/orders';
export const API_SITEBARCODES_LIST = 'wxapp/barcodes';
export const API_SITEBARCODES_GENERATE = 'wxapp/barcodes';
export const API_SITEBARCODES_SET_PRINTED = 'wxapp/barcodes';
export const API_SITEBARCODES_DELETE = 'wxapp/barcodes';
export const API_UPLOADFILE = 'upload';
export const API_MEMBER_INFO = 'wxapp/member';
export const API_MEMBER_BIND2SITE = 'wxapp/member/bind2site';
export const API_MEMBER_INFO_CHECK = 'wxapp/member/check';
export const API_MEMBER_INFO_PROFILE = 'wxapp/member/profile';
export const API_MEMBER_CREDITS = 'wxapp/moneys';
export const API_MEMBER_CREDITS2 = 'wxapp/scores';
export const API_MEMBER_ADDRESS = 'wxapp/addresses';
export const API_MEMBER_CHILDREN = 'wxapp/member/children';
export const API_MEMBER_ADDRESS_DEFAULT = 'wxapp/addresses/default';
export const API_MEMBER_CHILDREN_DEFAULT = 'wxapp/member/children/default';
export const API_MEMBER_ADDRESS_INFO = 'wxapp/addresses';
export const API_MEMBER_CHILDREN_INFO = 'wxapp/member/children';

export const API_MEMBER_ADDRESS_DELETE = 'wxapp/addresses';
export const API_MEMBER_CHILDREN_DELETE = 'wxapp/member/children';
export const API_MEMBER_ADDRESS_EDIT = 'wxapp/addresses';
export const API_APPOINTMENT_NEW = 'wxapp/orders';
export const API_APPOINTMENT_INFO = 'wxapp/orders';
export const API_APPOINTMENT_GRADE = 'wxapp/orders/grades';
export const API_APPOINTMENT_INFO_BARCODE = 'wxapp/orders/barcode';
export const API_APPOINTMENT_CANCEL = 'wxapp/orders/cancel';
export const API_APPOINTMENT_MEMBER_CONFIRM = 'wxapp/orders';
export const API_APPOINTMENT_STATISTICS = 'wxapp/orders/statistics';
export const API_APPOINTMENT_CHANGETIME = 'wxapp/orders/delay';
export const API_APPOINTMENT_PAYORDER = 'wxapp/orders/payorder';
export const API_APPOINTMENT_OUTBOUND = 'wxapp/outbounds';
export const API_APPOINTMENT_OUTBOUND2 = 'wxapp/outbounds/wastes';
export const API_APPOINTMENT_NOOUTBOUNDS = 'wxapp/orders/nooutbounds';
export const API_APPOINTMENT_LIST = 'wxapp/orders';
export const API_APPOINTMENT_RECYCLER_LIST = 'wxapp/recycler/orders';
export const API_RECYCLER_ORDER_GOT = 'wxapp/recyclers/check';
export const API_SHOP_GOODS_LIST = 'wxapp/shop/goods';
export const API_SHOP_GOODS_NEW_LIST = 'wxapp/shop/goods/new';
export const API_SHOP_GOODS_TOPS_LIST = 'wxapp/shop/goods/tops';
export const API_SHOP_GOODS_ORDERS = 'wxapp/shop/orders';
export const API_SHOP_GOODS_ORDERS_COUNT = 'wxapp/shop/orders/count';
export const API_SHOP_GOODS_ORDERS_INFO = 'wxapp/shop/orders';
export const API_SHOP_GOODS_ORDERS_INFO_DELIVERY = 'wxapp/shop/orders/delivery';
export const API_SHOP_GOODS_ORDERS_DELIVERY = 'wxapp/shop/orders/delivery';
export const API_SHOP_GOODS_ORDERS_DELIVERY_BIND = 'wxapp/shop/orders/delivery/bind';
export const API_SHOP_GOODS_ORDERS_CONFIRM = 'wxapp/shop/orders/confirm';
export const API_SHOP_GOODS_ORDERS_CANCEL = 'wxapp/shop/orders/cancel';
export const API_SHOP_GOODS_INFO = 'wxapp/shop/goods';
export const API_SHOP_GOODS_LIST_IDS = 'wxapp/shop/goods/ids';
export const API_SHOP_GOODS_PREPAY = 'wxapp/shop/orders/preorder';
export const API_SHOP_GOODS_CREATEORDER = 'wxapp/shop/orders';
export const API_SHOP_GOODS_PAYORDER = 'wxapp/shop/orders/payorder';
export const API_SHOP_GOODS_CLASSES = 'wxapp/shop/classes';
export const API_MONEY_WITHDRAW = 'wxapp/withdraws';
export const API_MONEY_INVEST = 'wxapp/invests';

export const API_SUBSCRIBE_GOODS_PAYORDER = 'wxapp/subscribe/orders/payorder';
export const API_SUBSCRIBE_GOODS_PAYLOSSORDER = 'wxapp/subscribe/orders/payloss';
export const API_SUBSCRIBE_GOODS_PREPAY = 'wxapp/subscribe/orders/preorder';
export const API_SUBSCRIBE_GOODS_ORDERS_CANCEL = 'wxapp/subscribe/orders/cancel';
export const API_SUBSCRIBE_GOODS_INFO = 'wxapp/subscribe/goods';
export const API_SUBSCRIBE_GOODS_ORDERS_CONFIRM = 'wxapp/subscribe/orders/confirm';
export const API_SUBSCRIBE_GOODS_LIST = 'wxapp/subscribe/goods';
export const API_SUBSCRIBE_GOODS_LIST_IDS = 'wxapp/subscribe/goods/ids';
export const API_SUBSCRIBE_GOODS_CLASSES = 'wxapp/subscribe/classes';
export const API_SUBSCRIBE_GOODS_CREATEORDER = 'wxapp/subscribe/orders';
export const API_SUBSCRIBE_GOODS_ORDERS = 'wxapp/subscribe/orders';


export const SERVICE_WINKT_AUTH_HEADER = 'WINKT-AUTH';
export const SERVICE_WINKT_COMMON_HEADER = 'WINKT-COMMON';
export const SERVICE_WINKT_MEMBER_HEADER = 'WINKT-MEMBER';
export const SERVICE_WINKT_LIVE_HEADER = 'WINKT-LIVE';
export const SERVICE_WINKT_SYSTEM_HEADER = 'WINKT-SYSTEM';
export const SERVICE_WINKT_RECYCLER_HEADER = 'WINKT-RECYCLER';
export const SERVICE_WINKT_ORDER_HEADER = 'WINKT-ORDER';

const request = option => {
    option.catchError = option.catchError !== undefined ? option.catchError : true;
    return new Promise<any>((resolve, reject) => {
        option.success = function (result: any) {
            resolve(result);
        };
        option.fail = function (error) {
            reject(error);
        }
        util.request(option);
    });
}

const get = (url, serviceHeader, params?:any, withToken = false, responseType:any = null) => {
    return request({url, data: params, method: 'GET', responseType, token: withToken, header: {'X-Requested-Service': serviceHeader}});
}

const post = (url, serviceHeader,  data?:any, withToken = false, responseType:any = null) => {
    return request({url, data, method: 'POST', responseType,token: withToken, header: {'X-Requested-Service': serviceHeader}});
}
const put = (url, serviceHeader, data?:any, withToken = false, responseType:any = null) => {
    return request({url, data, method: 'PUT', responseType,token: withToken, header: {'X-Requested-Service': serviceHeader}});
}

const del = (url, serviceHeader, data?:any, withToken = false, responseType:any = null) => {
    return request({url, data, method: 'DELETE', responseType,token: withToken, header: {'X-Requested-Service': serviceHeader}});
}

export const resolveUrl = (path) => {
    if(path && path.startsWith('http')) {
        return path;
    }
    return winktConfig.staticBaseUrl + '/' + path;
}


export default {
    request,
    get,
    post,
    util,
    put,
    del
}
