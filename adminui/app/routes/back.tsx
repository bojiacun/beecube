import {ActionFunction, json, redirect} from "@remix-run/node";
import {requireAuthenticated, sessionStorage} from "~/utils/auth.server";

export const action: ActionFunction = async ({request}) => {
    let userInfo = await requireAuthenticated(request, true);
    if(userInfo) {
        userInfo.perms = userInfo.perms!.filter((p:any)=>!p.componentName || (p.header && p.componentName=='app'));
    }
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    session.unset("APPID");
    session.unset("APP");
    session.unset("FROM");
    session.unset("APP_MENUS");
    session.unset("MODULE");
    await sessionStorage.commitSession(session);
    const perms = userInfo!.perms;
    //从用户的可用菜单中取出第一个菜单并重定向到该菜单地址
    const url = perms == null ? '/': perms[1].route;
    // return redirect(url!);
    return json({redirectTo: url!, perms: perms});
}

export default function Back() {
    return <></>
}
