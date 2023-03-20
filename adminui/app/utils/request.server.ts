import {LoginedUser, requireAuthenticated, sessionStorage} from "~/utils/auth.server";
import {json, RequestInfo} from "@remix-run/node";
import ServerEnv from "~/env";

export const BASE_URL =  ServerEnv.BASE_URL || 'http://localhost:9999';
export const LOGIN_SUCCESS_URL =  ServerEnv.LOGIN_SUCCESS_URL || '/';
export const LOGIN_URL = ServerEnv.LOGIN_URL || '/login';
export const LOGOUT_URL = ServerEnv.LOGOUT_URL || '/auth/logout';
export const USER_INFO_URL = ServerEnv.USER_INFO_URL || '/auth/user';
export const API_LOGIN = `${BASE_URL}/jeecg-system/sys/login`;
export const API_CAPTCHA = `${BASE_URL}/jeecg-system/sys/randomImage`;
export const API_ROLE_LIST = `${BASE_URL}/jeecg-system/sys/role/list`;
export const API_ROLE_ALL_LIST = `${BASE_URL}/jeecg-system/sys/role/queryall`;
export const API_ROLE_EDIT = `${BASE_URL}/jeecg-system/sys/role/edit`;
export const API_ROLE_ADD = `${BASE_URL}/jeecg-system/sys/role/add`;
export const API_ROLE_DELETE = `${BASE_URL}/jeecg-system/sys/role/delete`;
export const API_ROLE_QUERYTREELIST = `${BASE_URL}/jeecg-system/sys/role/queryTreeList`;
export const API_ROLE_PERMISSIONS = `${BASE_URL}/jeecg-system/sys/permission/queryRolePermission`;
export const API_ROLE_PERMISSIONS_SAVE = `${BASE_URL}/jeecg-system/sys/permission/saveRolePermission`;

export const API_DEPARTROLE_PERMISSIONS = `${BASE_URL}/jeecg-system/sys/sysDepartPermission/queryTreeListForDeptRole`;
export const API_DEPARTROLE_PERMISSIONS_SAVE = `${BASE_URL}/jeecg-system/sys/sysDepartPermission/saveDeptRolePermission`;

export const API_PERMISSION_LIST = `${BASE_URL}/jeecg-system/sys/permission/list`;
export const API_PERMISSION_RULE_LIST = `${BASE_URL}/jeecg-system/sys/permission/queryPermissionRule`;
export const API_PERMISSION_RULE_ADD = `${BASE_URL}/jeecg-system/sys/permission/addPermissionRule`;
export const API_PERMISSION_RULE_EDIT = `${BASE_URL}/jeecg-system/sys/permission/editPermissionRule`;
export const API_PERMISSION_RULE_DELETE = `${BASE_URL}/jeecg-system/sys/permission/deletePermissionRule`;
export const API_PERMISSION_ADD = `${BASE_URL}/jeecg-system/sys/permission/add`;
export const API_PERMISSION_EDIT = `${BASE_URL}/jeecg-system/sys/permission/edit`;
export const API_PERMISSION_DELETE = `${BASE_URL}/jeecg-system/sys/permission/delete`;
export const API_PERMISSION_CHECKDUPLICATION = `${BASE_URL}/jeecg-system/sys/permission/checkPermDuplication`;


export const API_DEPARTMENT_PERMISSIONS = `${BASE_URL}/jeecg-system/sys/permission/queryDepartPermission`;
export const API_DEPARTMENT_PERMISSIONS_SAVE = `${BASE_URL}/jeecg-system/sys/permission/saveDepartPermission`;


export const API_PERMISSION_CURRENT_USER = `${BASE_URL}/jeecg-system/sys/permission/getUserPermissionByToken`;

export const API_USER_EDIT = `${BASE_URL}/jeecg-system/sys/user/edit`;
export const API_USER_EDIT_PROFILE = `${BASE_URL}/jeecg-system/sys/user/profile`;
export const API_USER_RESTORE = `${BASE_URL}/jeecg-system/sys/user/putRecycleBin`;
export const API_USER_UPDATE_PASSWORD = `${BASE_URL}/jeecg-system/sys/user/updatePassword`;
export const API_USER_CHANGE_PASSWORD = `${BASE_URL}/jeecg-system/sys/user/changePassword`;
export const API_USER_FROZEN = `${BASE_URL}/jeecg-system/sys/user/frozenBatch`;
export const API_USER_DELETE = `${BASE_URL}/jeecg-system/sys/user/delete`;
export const API_USER_TRASH_DELETE = `${BASE_URL}/jeecg-system/sys/user/deleteRecycleBin`;
export const API_USER_ADD = `${BASE_URL}/jeecg-system/sys/user/add`;

export const API_POSITION_LIST = `${BASE_URL}/jeecg-system/sys/position/list`;
export const API_POSITION_EDIT = `${BASE_URL}/jeecg-system/sys/position/edit`;
export const API_POSITION_ADD = `${BASE_URL}/jeecg-system/sys/position/add`;
export const API_POSITION_DELETE = `${BASE_URL}/jeecg-system/sys/position/delete`;

export const API_DATABASE_DICT_LIST = `${BASE_URL}/jeecg-system/sys/dict/list`;
export const API_DATABASE_DICT_REFRESH = `${BASE_URL}/jeecg-system/sys/dict/refreshCache`;
export const API_DATABASE_DICT_EDIT = `${BASE_URL}/jeecg-system/sys/dict/edit`;
export const API_DATABASE_DICT_ADD = `${BASE_URL}/jeecg-system/sys/dict/add`;
export const API_DATABASE_DICT_DELETE = `${BASE_URL}/jeecg-system/sys/dict/delete`;


export const API_DATABASE_DICT_ITEM_LIST = `${BASE_URL}/jeecg-system/sys/dictItem/list`;
export const API_DATABASE_DICT_ITEM_CHECK = `${BASE_URL}/jeecg-system/sys/dictItem/dictItemCheck`;
export const API_DATABASE_DICT_ITEM_EDIT = `${BASE_URL}/jeecg-system/sys/dictItem/edit`;
export const API_DATABASE_DICT_ITEM_ADD = `${BASE_URL}/jeecg-system/sys/dictItem/add`;
export const API_DATABASE_DICT_ITEM_DELETE = `${BASE_URL}/jeecg-system/sys/dictItem/delete`;

export const API_SYSDEPART_QUERYTREELIST = `${BASE_URL}/jeecg-system/sys/sysDepart/queryTreeList`;
export const API_SYSDEPART_MY_LIST= `${BASE_URL}/jeecg-system/sys/sysDepart/queryMyDeptTreeList`;
export const API_SYSDEPART_EDIT = `${BASE_URL}/jeecg-system/sys/sysDepart/edit`;
export const API_SYSDEPART_ADD = `${BASE_URL}/jeecg-system/sys/sysDepart/add`;
export const API_SYSDEPART_DELETE = `${BASE_URL}/jeecg-system/sys/sysDepart/deleteBatch`;
export const API_SYSDEPART_ROLE_ADD = `${BASE_URL}/jeecg-system/sys/sysDepartRole/add`;
export const API_SYSDEPART_ROLE_EDIT = `${BASE_URL}/jeecg-system/sys/sysDepartRole/edit`;
export const API_SYSDEPART_ROLE_DELETE = `${BASE_URL}/jeecg-system/sys/sysDepartRole/deleteBatch`;

export const API_DUPLICATE_CEHCK = `${BASE_URL}/jeecg-system/sys/duplicate/check`;

export const API_OSS_FILE_LIST = `${BASE_URL}/jeecg-system/sys/oss/file/list`;
export const API_OSS_FILE_UPLOAD = `${BASE_URL}/jeecg-system/sys/oss/file/upload`;
export const API_OSS_FILE_DELETE = `${BASE_URL}/jeecg-system/sys/oss/file/delete`;


export const API_GATEWAY_LIST = `${BASE_URL}/jeecg-system/sys/gatewayRoute/list`;
export const API_GATEWAY_DELETE = `${BASE_URL}/jeecg-system/sys/gatewayRoute/delete`;
export const API_GATEWAY_UPDATEALL = `${BASE_URL}/jeecg-system/sys/gatewayRoute/updateAll`;

export const API_TENANT_LIST = `${BASE_URL}/jeecg-system/sys/tenant/list`;
export const API_TENANT_LIST_ALL = `${BASE_URL}/jeecg-system/sys/tenant/queryList`;
export const API_TENANT_ADD = `${BASE_URL}/jeecg-system/sys/tenant/add`;
export const API_TENANT_EDIT = `${BASE_URL}/jeecg-system/sys/tenant/edit`;
export const API_TENANT_DELETE = `${BASE_URL}/jeecg-system/sys/tenant/delete`;

export const API_USER_LIST = `${BASE_URL}/jeecg-system/sys/user/list`;
export const API_USER_RECYCLE = `${BASE_URL}/jeecg-system/sys/user/recycleBin`;
export const API_USER_INFO = `${BASE_URL}/jeecg-system/sys/user/getUserInfo`;
export const API_USER_ROLE_LIST_ALL = `${BASE_URL}/jeecg-system/sys/user/queryUserRole`;
export const API_USER_DEPARTMENT_LIST_ALL = `${BASE_URL}/jeecg-system/sys/user/userDepartList`;
export const API_DEPARTMENT_USER_LIST = `${BASE_URL}/jeecg-system/sys/user/departUserList`;
export const API_DEPARTMENT_ROLE_LIST = `${BASE_URL}/jeecg-system/sys/sysDepartRole/list`;
export const API_DEPARTMENT_ROLE_LIST_ALL = `${BASE_URL}/jeecg-system/sys/sysDepartRole/getDeptRoleList`;
export const API_DEPARTMENT_ROLE_USERS = `${BASE_URL}/jeecg-system/sys/sysDepartRole/getDeptRoleByUserId`;
export const API_DEPARTMENT_ROLE_USERS_ADD = `${BASE_URL}/jeecg-system/sys/sysDepartRole/deptRoleUserAdd`;
export const API_USER_ADDSYSUSERROLE = `${BASE_URL}/jeecg-system/sys/user/addSysUserRole`;
export const API_USER_ROLE_LIST = `${BASE_URL}/jeecg-system/sys/user/userRoleList`;
export const API_USER_ROLE_DELETE = `${BASE_URL}/jeecg-system/sys/user/deleteUserRole`;
export const API_USER_DEPARTMENT_DELETE = `${BASE_URL}/jeecg-system/sys/user/deleteUserInDepartBatch`;


export const API_APP_MODULE_LIST = `${BASE_URL}/beecube-app/app/modules/list`;
export const API_APP_MODULE_ALL_LIST = `${BASE_URL}/beecube-app/app/modules/all`;
export const API_APP_MODULE_INSTALL = `${BASE_URL}/beecube-app/app/modules/install`;
export const API_APP_MODULE_UNINSTALL = `${BASE_URL}/beecube-app/app/modules/uninstall`;
export const API_APP_MODULE_UPGRADE = `${BASE_URL}/beecube-app/app/modules/upgrade`;

export const API_APP_LIST = `${BASE_URL}/beecube-app/app/list`;
export const API_APP_LINKS = `${BASE_URL}/beecube-app/app/links`;
export const API_APP_SETTING_LIST = `${BASE_URL}/beecube-app/app/settings/all`;
export const API_APP_SETTINGS_UPDATE = `${BASE_URL}/beecube-app/app/settings/updateAll`;
export const API_APP_MEMBER_LIST = `${BASE_URL}/beecube-app/app/members/list`;
export const API_APP_MEMBER_DELETE = `${BASE_URL}/beecube-app/app/members/delete`;
export const API_APP_MEMBER_EDIT = `${BASE_URL}/beecube-app/app/members/edit`;
export const API_APP_NAV_LIST = `${BASE_URL}/beecube-app/app/navs/list`;
export const API_APP_NAV_ADD = `${BASE_URL}/beecube-app/app/navs/add`;
export const API_APP_NAV_EDIT = `${BASE_URL}/beecube-app/app/navs/edit`;
export const API_APP_NAV_DELETE = `${BASE_URL}/beecube-app/app/navs/delete`;

export const API_APP_MEMBER_MONEY_RECORDS_LIST = `${BASE_URL}/beecube-app/app/money/records`;


export const API_APP_DIY_PAGE_LIST = `${BASE_URL}/beecube-app/app/diy/pages/all`;
export const API_APP_DIY_PAGE_EDIT = `${BASE_URL}/beecube-app/app/diy/pages/edit`;
export const API_APP_DIY_PAGE_ADD = `${BASE_URL}/beecube-app/app/diy/pages/add`;

export const API_APP_DETAIL = `${BASE_URL}/beecube-app/app/queryById`;
export const API_APP_MODULE_DETAIL = `${BASE_URL}/beecube-app/app/modules/queryById`;
export const API_APP_MENU_LIST = `${BASE_URL}/beecube-app/app/menus/all`;
export const API_APP_USER_LIST = `${BASE_URL}/beecube-app/app/users/list`;
export const API_APP_USER_BIND = `${BASE_URL}/beecube-app/app/users/bind`;
export const API_APP_USER_DELETE = `${BASE_URL}/beecube-app/app/users/delete`;
export const API_APP_DELETE = `${BASE_URL}/beecube-app/app/delete`;
export const API_APP_ADD = `${BASE_URL}/beecube-app/app/add`;
export const API_APP_EDIT = `${BASE_URL}/beecube-app/app/edit`;
export const API_APP_HTTPTRACE_LIST = `${BASE_URL}/beecube-app/actuator/httptrace`;

export const API_DATALOG_LIST = `${BASE_URL}/jeecg-system/sys/dataLog/list`;
export const API_LOG_LIST = `${BASE_URL}/jeecg-system/sys/log/list`;
export const API_HTTPTRACE_LIST = `${BASE_URL}/jeecg-system/actuator/httptrace`;
export const API_CRONJOB_LIST = `${BASE_URL}/jeecg-system/sys/quartzJob/list`;
export const API_CRONJOB_RESUME = `${BASE_URL}/jeecg-system/sys/quartzJob/resume`;
export const API_CRONJOB_PAUSE = `${BASE_URL}/jeecg-system/sys/quartzJob/pause`;
export const API_CRONJOB_ADD = `${BASE_URL}/jeecg-system/sys/quartzJob/add`;
export const API_CRONJOB_EDIT = `${BASE_URL}/jeecg-system/sys/quartzJob/edit`;
export const API_CRONJOB_DELETE = `${BASE_URL}/jeecg-system/sys/quartzJob/delete`;
export const API_CRONJOB_EXECUTE = `${BASE_URL}/jeecg-system/sys/quartzJob/execute`;


export const API_PAIMAI_APIGOODS_LIST = `${BASE_URL}/paimai/api/goods/list`;
export const API_PAIMAI_APIPERFORMANCE_LIST = `${BASE_URL}/paimai/api/performances/list`;
export const API_PAIMAI_APIAUCTION_LIST = `${BASE_URL}/paimai/api/auctions/list`;

export const API_PAIMAI_GOODS_LIST = `${BASE_URL}/paimai/goods/list`;
export const API_PAIMAI_GOODS_RUNNING_LIST = `${BASE_URL}/paimai/goods/running`;
export const API_PAIMAI_GOODS_SELECT_LIST = `${BASE_URL}/paimai/goods/select`;
export const API_PAIMAI_GOODS_SELECTED_LIST = `${BASE_URL}/paimai/goods/selected`;
export const API_PAIMAI_GOODS_ADD = `${BASE_URL}/paimai/goods/add`;
export const API_PAIMAI_GOODS_EDIT = `${BASE_URL}/paimai/goods/edit`;
export const API_PAIMAI_GOODS_OFFER = `${BASE_URL}/paimai/goods/offers`;
export const API_PAIMAI_GOODS_DELETE = `${BASE_URL}/paimai/goods/delete`;

export const API_PAIMAI_GOODSOFFER_DEAL = `${BASE_URL}/paimai/goods/deal`;


export const API_PAIMAI_PERFORMANCE_LIST = `${BASE_URL}/paimai/performances/list`;
export const API_PAIMAI_PERFORMANCE_START = `${BASE_URL}/paimai/performances/start`;
export const API_PAIMAI_PERFORMANCE_END = `${BASE_URL}/paimai/performances/end`;
export const API_PAIMAI_PERFORMANCE_SELECT_LIST = `${BASE_URL}/paimai/performances/select`;
export const API_PAIMAI_PERFORMANCE_SELECTED_LIST = `${BASE_URL}/paimai/performances/selected`;
export const API_PAIMAI_PERFORMANCE_ADD = `${BASE_URL}/paimai/performances/add`;
export const API_PAIMAI_PERFORMANCE_ADDGOODS = `${BASE_URL}/paimai/performances/goods/add`;
export const API_PAIMAI_PERFORMANCE_EDIT = `${BASE_URL}/paimai/performances/edit`;
export const API_PAIMAI_PERFORMANCE_DELETE = `${BASE_URL}/paimai/performances/delete`;

export const API_PAIMAI_PERFORMANCE_GOODS_START = `${BASE_URL}/paimai/performances/goods/start`;
export const API_PAIMAI_PERFORMANCE_GOODS_END = `${BASE_URL}/paimai/performances/goods/end`;

export const API_PAIMAI_PERFORMANCE_DELETEGOODS = `${BASE_URL}/paimai/performances/goods/remove`;

export const API_PAIMAI_AUCTION_LIST = `${BASE_URL}/paimai/auctions/list`;
export const API_PAIMAI_AUCTION_ADD = `${BASE_URL}/paimai/auctions/add`;
export const API_PAIMAI_AUCTION_ADDPERFORMANCES = `${BASE_URL}/paimai/auctions/performances/add`;
export const API_PAIMAI_AUCTION_EDIT = `${BASE_URL}/paimai/auctions/edit`;
export const API_PAIMAI_AUCTION_DELETE = `${BASE_URL}/paimai/auctions/delete`;
export const API_PAIMAI_AUCTION_DELETEPERFORMANCES = `${BASE_URL}/paimai/auctions/performances/remove`;


export const API_PAIMAI_ARTICLE_LIST = `${BASE_URL}/paimai/articles/list`;
export const API_PAIMAI_ARTICLE_ADD = `${BASE_URL}/paimai/articles/add`;
export const API_PAIMAI_ARTICLE_EDIT = `${BASE_URL}/paimai/articles/edit`;
export const API_PAIMAI_ARTICLE_DELETE = `${BASE_URL}/paimai/articles/delete`;

export const API_PAIMAI_ARTICLE_CLASS_LIST = `${BASE_URL}/paimai/article/classes/list`;
export const API_PAIMAI_ARTICLE_CLASS_ALLLIST = `${BASE_URL}/paimai/article/classes/all`;
export const API_PAIMAI_ARTICLE_CLASS_ADD = `${BASE_URL}/paimai/article/classes/add`;
export const API_PAIMAI_ARTICLE_CLASS_EDIT = `${BASE_URL}/paimai/article/classes/edit`;
export const API_PAIMAI_ARTICLE_CLASS_DELETE = `${BASE_URL}/paimai/article/classes/delete`;

export const API_PAIMAI_VIEW_LIST = `${BASE_URL}/paimai/views/list`;
export const API_PAIMAI_OFFER_LIST = `${BASE_URL}/paimai/offers/list`;
export const API_PAIMAI_DEPOSIT_LIST = `${BASE_URL}/paimai/deposits/list`;
export const API_PAIMAI_DEPOSIT_REFUND = `${BASE_URL}/paimai/deposits/refund`;
export const API_PAIMAI_FOLLOW_LIST = `${BASE_URL}/paimai/follows/list`;

export const API_PAIMAI_ORDER_LIST = `${BASE_URL}/paimai/orders/list`;
export const API_PAIMAI_ORDER_DELIVERY = `${BASE_URL}/paimai/orders/delivery`;
export const API_PAIMAI_ORDER_DELIVERY_CONFIRM = `${BASE_URL}/paimai/orders/delivery/confirm`;
export const API_PAIMAI_ORDER_PAY_CONFIRM = `${BASE_URL}/paimai/orders/pay/confirm`;
export const API_PAIMAI_ORDER_AFTER_LIST = `${BASE_URL}/paimai/orders/afters/list`;

export const API_PAIMAI_SETTING_LIST = `${BASE_URL}/paimai/settings/all`;
export const API_PAIMAI_SETTINGS_UPDATE = `${BASE_URL}/paimai/settings/updateAll`;

export const API_PAIMAI_GOODS_CLASS_LIST = `${BASE_URL}/paimai/goods/class/list`;
export const API_PAIMAI_GOODS_CLASS_ALLLIST = `${BASE_URL}/paimai/goods/class/all`;
export const API_PAIMAI_GOODS_CLASS_ADD = `${BASE_URL}/paimai/goods/class/add`;
export const API_PAIMAI_GOODS_CLASS_EDIT = `${BASE_URL}/paimai/goods/class/edit`;
export const API_PAIMAI_GOODS_CLASS_DELETE = `${BASE_URL}/paimai/goods/class/delete`;

export const API_PAIMAI_BUYOUT_CLASS_LIST = `${BASE_URL}/paimai/buyout/classes/list`;
export const API_PAIMAI_BUYOUT_CLASS_ALLLIST = `${BASE_URL}/paimai/buyout/classes/all`;
export const API_PAIMAI_BUYOUT_CLASS_ADD = `${BASE_URL}/paimai/buyout/classes/add`;
export const API_PAIMAI_BUYOUT_CLASS_EDIT = `${BASE_URL}/paimai/buyout/classes/edit`;
export const API_PAIMAI_BUYOUT_CLASS_DELETE = `${BASE_URL}/paimai/buyout/classes/delete`;

export const API_APP_USER_QUERY = `${BASE_URL}/beecube-app/app/users/admin`;


export const API_DEMO_TEST_JEECG_LIST = `${BASE_URL}/jeecg-demo/test/jeecgDemo/list`;


export const postFormInit = (data: any): RequestInit=> {
    return {method: 'post', body: data, headers: {'Content-Type': 'application/json'}};
}
export const deleteFormInit = (data: any): RequestInit=> {
    return {method: 'delete', body: data, headers: {'Content-Type': 'application/json'}};
}
export const putFormInit = (data: any): RequestInit=> {
    return {method: 'put', body: data, headers: {'Content-Type': 'application/json'}};
}

export const requestWithToken = (request: Request) => async (url:RequestInfo, options:any = {}) => {
    //@ts-ignore
    const user: LoginedUser = await requireAuthenticated(request);
    options.headers = options.headers || {};
    options.headers['X-Access-Token'] = user.token;
    options.headers['Authorization'] = user.token;
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    if(session.has("APPID")) {
        options.headers['X-App-Id'] = session.get("APPID");
    }
    const res = await fetch(url, options);
    if(res.status != 200) {
        throw new Response(res.statusText, {status: res.status});
    }
    const result = await res.json();
    if (result.code === 401) {
        throw new Response(result.message, {status: 401});
    } else if (result.code == 510) {
        throw new Response(result.message, {status: 403});
    } else if (result.code == 403) {
        throw new Response(result.message, {status: 403});
    }
    return result;
}