import {createCookie, createCookieSessionStorage, createFileSessionStorage, createMemorySessionStorage} from "@remix-run/node";
import {Authenticator, AuthorizationError} from "remix-auth";
import {FormStrategy} from "remix-auth-form";
//@ts-ignore
import _ from 'lodash';
import {API_LOGIN, API_PERMISSION_CURRENT_USER, LOGIN_URL, postFormInit} from "~/utils/request.server";

export type MenuPerm = {
    id?: any;
    title?: string;
    route?: string;
    icon?: string;
    header?: string;
    children?: MenuPerm[];
}

export type LoginedUser = {
    token: string;
    userInfo: UserInfo;
    perms?: MenuPerm[];
    originalPerms?: any[];
}

export type UserInfo = {
    realname: string;
    avatar: string;
    post: string;
    phone: string;
    username: string;
    id: string;
}

const sessionSecret:string = process.env["SESSION_SECRET"] || 'bojinhong';

const sessionCookie = createCookie(process.env["COOKIE_NAME"] || 'RSESSIONID', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
});

export const sessionStorage = createFileSessionStorage({
    cookie: sessionCookie,
    dir: process.env["SESSION_STORAGE"] || "/Users/baojinhong/remix-sessions"
});

export const auth = new Authenticator<LoginedUser>(sessionStorage);

const translateMenu2MenuPerms = (menu:any): MenuPerm => {
    return {
        id: menu.id,
        title: menu.meta.title,
        route: menu.path,
        icon: menu.meta.icon,
        children: menu?.children?.filter((item:any)=>!item.hidden).map(translateMenu2MenuPerms) || null,
    }
}

auth.use(
    new FormStrategy<LoginedUser>(async ({form}) => {
        const data = {username: form.get("username"), password: form.get("password"), captcha: form.get("captcha"), checkKey: form.get("checkKey")};
        if(_.isEmpty(data.username) || _.isEmpty(data.password)) {
            throw new AuthorizationError('username or password is required');
        }
        const res = await fetch(API_LOGIN, postFormInit(JSON.stringify(data)));
        const result = await res.json();
        if(!result.success) {
            throw new AuthorizationError(result?.message || 'login fail');
        }

        const userInfo = result.result.userInfo;
        const token = result.result.token;
        let options:any = { headers: {} };
        options.headers['X-Access-Token'] = token;
        options.headers['Authorization'] = token;
        const permsRes = await fetch(API_PERMISSION_CURRENT_USER, options);
        const permsResult = await permsRes.json();


        if(!permsResult.success) {
            throw new AuthorizationError(permsResult?.message || 'login fail');
        }
        const perms = permsResult.result.menu.filter((item:any)=>!item.hidden).map(translateMenu2MenuPerms);

        return {
            token: token,
            userInfo: {realname: userInfo.realname, username: userInfo.username, id: userInfo.id, avatar: userInfo.avatar, post: userInfo.post, phone: userInfo.phone},
            perms: perms,
            originalPerms: permsResult.result
        };
    })
)

export const requireAuthenticated = async (request: Request, redirect = true) => {
    if(redirect) {
        return await auth.isAuthenticated(request, {failureRedirect: LOGIN_URL});
    }
    return await auth.isAuthenticated(request);
}

export const requireAuthenticatedLoader = async ({request}:{request: Request}) => {
    return await requireAuthenticated(request);
}

export const logout = async (request: Request) => {
    return await auth.logout(request, {redirectTo: LOGIN_URL});
}