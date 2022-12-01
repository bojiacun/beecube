import {createCookie, createCookieSessionStorage, createMemorySessionStorage} from "@remix-run/node";
import {Authenticator, AuthorizationError} from "remix-auth";
import {FormStrategy} from "remix-auth-form";
//@ts-ignore
import _ from 'lodash';
import {API_LOGIN, API_PERMISSION_CURRENT_USER, LOGIN_URL, postFormInit} from "~/utils/request.server";

export type MenuPerm = {
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
}

export type UserInfo = {
    realname: string;
    avatar: string;
    post: string;
    phone: string;
    username: string;
    id: string;
}

const sessionSecret:string = process.env["SESSION_SECRET "] || 'bojinhong';

const sessionCookie = createCookie(process.env["COOKIE_NAME "] || 'RSESSIONID', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
});

export const sessionStorage = createMemorySessionStorage({
    cookie: sessionCookie
});

export const auth = new Authenticator<LoginedUser>(sessionStorage);

auth.use(
    new FormStrategy<LoginedUser>(async ({form}) => {
        const data = {username: form.get("username"), password: form.get("password"), captcha: form.get("captcha"), checkKey: form.get("checkKey")};
        if(_.isEmpty(data.username) || _.isEmpty(data.password)) {
            throw new AuthorizationError('username or password is required');
        }
        console.log(data);
        const res = await fetch(API_LOGIN, postFormInit(JSON.stringify(data)));
        const result = await res.json();
        console.log(result);
        if(result.code !== 200) {
            throw new AuthorizationError(result?.message || 'login fail');
        }
        const userInfo = result.result.userInfo;
        const token = result.result.token;

        // const permsRes = await fetch(API_PERMISSION_CURRENT_USER);
        // const permsResult = await permsRes.json();
        // if(result.code !== 200) {
        //     throw new AuthorizationError(permsResult?.message || 'login fail');
        // }
        // console.log(permsResult);
        // const perms = null;

        return {
            token: token,
            userInfo: {realname: userInfo.realname, username: userInfo.username, id: userInfo.id, avatar: userInfo.avatar, post: userInfo.post, phone: userInfo.phone},
        };
    })
)

export const requireAuthenticated = async (request: Request) => {
    return await auth.isAuthenticated(request, {failureRedirect: LOGIN_URL});
}

export const requireAuthenticatedLoader = async ({request}:{request: Request}) => {
    return await requireAuthenticated(request);
}

export const logout = async (request: Request) => {
    return await auth.logout(request, {redirectTo: LOGIN_URL});
}