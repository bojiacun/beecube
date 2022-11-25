import {LoginedUser, requireAuthenticated} from "~/utils/auth.server";
import {json, RequestInfo} from "@remix-run/node";
import {showToastError} from "~/utils/utils";

export const BASE_URL =  process.env.BASE_URL || 'http://localhost:9999';
export const LOGIN_SUCCESS_URL =  process.env.LOGIN_SUCCESS_URL || '/';
export const LOGIN_URL = process.env.LOGIN_URL || '/login';
export const LOGOUT_URL = process.env.LOGOUT_URL || '/auth/logout';
export const USER_INFO_URL = process.env.USER_INFO_URL || '/auth/user';
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

export const API_USER_EDIT = `${BASE_URL}/jeecg-system/sys/user/edit`;
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

export const API_DUPLICATE_CEHCK = `${BASE_URL}/jeecg-system/sys/duplicate/check`;

export const API_OSS_FILE_LIST = `${BASE_URL}/jeecg-system/sys/oss/file/list`;
export const API_OSS_FILE_UPLOAD = `${BASE_URL}/jeecg-system/sys/oss/file/upload`;
export const API_OSS_FILE_DELETE = `${BASE_URL}/jeecg-system/sys/oss/file/delete`;


export const API_TENANT_LIST = `${BASE_URL}/jeecg-system/sys/tenant/queryList`;

export const API_USER_LIST = `${BASE_URL}/jeecg-system/sys/user/list`;
export const API_USER_ROLE_LIST_ALL = `${BASE_URL}/jeecg-system/sys/user/queryUserRole`;
export const API_USER_DEPARTMENT_LIST_ALL = `${BASE_URL}/jeecg-system/sys/user/userDepartList`;
export const API_DEPARTMENT_USER_LIST = `${BASE_URL}/jeecg-system/sys/user/departUserList`;
export const API_USER_ADDSYSUSERROLE = `${BASE_URL}/jeecg-system/sys/user/addSysUserRole`;
export const API_USER_ROLE_LIST = `${BASE_URL}/jeecg-system/sys/user/userRoleList`;
export const API_USER_ROLE_DELETE = `${BASE_URL}/jeecg-system/sys/user/deleteUserRole`;
export const API_USER_DEPARTMENT_DELETE = `${BASE_URL}/jeecg-system/sys/user/deleteUserInDepartBatch`;



export const API_GATEWAY_LIST = `${BASE_URL}/jeecg-system/sys/gatewayRoute/list`;
export const API_DATALOG_LIST = `${BASE_URL}/jeecg-system/sys/dataLog/list`;
export const API_LOG_LIST = `${BASE_URL}/jeecg-system/sys/log/list`;
export const API_HTTPTRACE_LIST = `${BASE_URL}/jeecg-system/actuator/httptrace`;
export const API_CRONJOB_LIST = `${BASE_URL}/jeecg-system/sys/quartzJob/list`;
export const API_CRONJOB_RESUME = `${BASE_URL}/jeecg-system/sys/quartzJob/resume`;
export const API_CRONJOB_EXECUTE = `${BASE_URL}/jeecg-system/sys/quartzJob/execute`;

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
    const user: LoginedUser = await requireAuthenticated(request);
    options.headers = options.headers || {};
    options.headers['X-Access-Token'] = user.token;
    options.headers['Authorization'] = user.token;
    const res = await fetch(url, options);
    const result = await res.json();
    if(result.code === 401) {
        throw new Response(result.message, {status: 401});
    }
    return result;
}