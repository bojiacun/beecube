import LayoutVertical from "~/layouts/layout-vertical/LayoutVertical";
import {useContext} from "react";
import ThemeContext from "themeConfig";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_LIST, API_APP_MENU_LIST, requestWithToken} from "~/utils/request.server";
import _ from "lodash";
import querystring from "querystring";
export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;


function recursiveFilterPerms(perm:any, menus:any) {
    if(perm.children) {
        perm.children = perm.children.filter((child:any) => {
            return _.indexOf(menus, child.id) >= 0;
        }).map((child:any)=>recursiveFilterPerms(child, menus));
    }
    return perm;
}

export async function loader({request}:any) {
    let userInfo = await requireAuthenticated(request, false);
    if(!userInfo || !userInfo.perms) throw new Response("用户无权访问该页面", {status: 403});
    //处理当前用户的权限，过滤掉应用的权限,取用户权限和应用权限交集部分
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    } else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_APP_MENU_LIST+queryString);
    const appMenus = result.result;
    const menus = appMenus.map((m:any)=>m.menuId);
    userInfo.perms = userInfo.perms.filter((p:any)=>_.indexOf(menus, p.id)>=0).map((p:any)=>recursiveFilterPerms(p, menus));
    return {userInfo: userInfo};
}

export default function Console() {
    const {startPageLoading, stopPageLoading} = useContext(ThemeContext);
    return (
        <LayoutVertical startPageLoading={startPageLoading} stopPageLoading={stopPageLoading}>

        </LayoutVertical>
    );
}