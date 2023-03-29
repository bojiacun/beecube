import {LoaderFunction, redirect} from "@remix-run/node";
import {requireAuthenticated, sessionStorage} from "~/utils/auth.server";
import {
    API_APP_DETAIL,
    API_APP_MENU_LIST,
    API_APP_MODULE_DETAIL,
    API_APP_USER_QUERY,
    requestWithToken
} from "~/utils/request.server";
import _ from "lodash";

function recursiveFilterPerms(perm:any, menus:any) {
    if(perm.children) {
        perm.children = perm.children.filter((child:any) => {
            return _.indexOf(menus, child.id) >= 0;
        }).map((child:any)=>recursiveFilterPerms(child, menus));
    }
    return perm;
}
export const loader: LoaderFunction = async ({request}) => {
    let userInfo = await requireAuthenticated(request, true);
    if(!userInfo || !userInfo.perms) {
        throw new Response("用户登录失败", {status: 500});
    }
    let redirectUrl = '/';
    //查询用户是否为某个APP的管理员，如果是直接跳转到应用页面
    let result = await requestWithToken(request)(API_APP_USER_QUERY + '?userId='+userInfo.userInfo.id);
    const appUsers = result.result;
    //应用管理员
    if(appUsers.length == 1) {
        let result = appUsers[0];
        const appId = result.appId;
        const appResult = await requestWithToken(request)(API_APP_DETAIL+"?id="+appId);
        const app = appResult.result;
        let queryString = '?appid='+appId;
        result = await requestWithToken(request)(API_APP_MENU_LIST+queryString);
        const appMenus = result.result;
        const menus = appMenus.map((m:any)=>m.menuId);
        userInfo.perms = userInfo.perms.filter((p:any)=>_.indexOf(menus, p.id)>=0).map((p:any)=>recursiveFilterPerms(p, menus));
        const appModuleResult = await requestWithToken(request)(API_APP_MODULE_DETAIL+'?id='+app.moduleId);
        const appModule = appModuleResult.result;
        const session = await sessionStorage.getSession(request.headers.get('Cookie'));
        session.set("APPID", appId);
        session.set("APP", JSON.stringify(app));
        session.set("MODULE", appModule.identify);
        session.set("FROM", "login");
        session.set("APP_MENUS", userInfo.perms);
        await sessionStorage.commitSession(session);
        //取出该应用的菜单跳转到第一个
        const perms = userInfo!.perms;
        //从用户的可用菜单中取出第一个菜单并重定向到该菜单地址
        redirectUrl = perms == null ? '/': perms[1].route!;
    }
    else {
        userInfo.perms = userInfo.perms!.filter((p:any)=>!p.componentName || (p.header && p.componentName=='app'));
        const perms = userInfo!.perms;
        //从用户的可用菜单中取出第一个菜单并重定向到该菜单地址
        redirectUrl = perms == null ? '/': perms[1].route!;
    }


    return redirect(redirectUrl);
}

export default function Index() {
    return <></>
}
