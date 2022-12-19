import {ActionFunction, redirect} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {sessionStorage} from "~/utils/auth.server";
import _ from 'lodash';
import {API_APP_MENU_LIST, API_ROLE_ADD, postFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";


function recursiveFilterPerms(perm:any, menus:any) {
    if(perm.children) {
        perm.children = perm.children.filter((child:any) => {
            return _.indexOf(menus, child.id) >= 0;
        }).map((child:any)=>recursiveFilterPerms(child, menus));
    }
    return perm;
}


export const action: ActionFunction = async ({request}) => {
    let userInfo = await requireAuthenticated(request, false);
    if(!userInfo || !userInfo.perms) {
        throw new Response("用户无权访问该页面", {status: 403});
    }
    const formData = await request.formData();
    const appId = formData.get("id");
    //处理当前用户的权限，过滤掉应用的权限,取用户权限和应用权限交集部分
    let queryString = '?appid='+appId;
    const result = await requestWithToken(request)(API_APP_MENU_LIST+queryString);
    const appMenus = result.result;
    const menus = appMenus.map((m:any)=>m.menuId);
    userInfo.perms = userInfo.perms.filter((p:any)=>_.indexOf(menus, p.id)>=0).map((p:any)=>recursiveFilterPerms(p, menus));
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    session.set("APPID", appId);
    session.set("FROM", "platform");
    session.set("APP_MENUS", userInfo.perms);
    await sessionStorage.commitSession(session);
    //取出该应用的菜单跳转到第一个
    const perms = userInfo!.perms;
    //从用户的可用菜单中取出第一个菜单并重定向到该菜单地址
    const url = perms == null ? '/': perms[1].route;
    return redirect(url!);
}