import {createCookieSessionStorage} from "@remix-run/node";
import {Authenticator, AuthorizationError} from "remix-auth";
import {FormStrategy} from "remix-auth-form";
//@ts-ignore
import _ from 'lodash';
import {API_LOGIN, LOGIN_URL, postFormInit} from "~/utils/request.server";


export type LoginedUser = {
    token: string;
    userInfo: UserInfo;
}

export type UserInfo = {
    realName: string;
    avatar: string;
    post: string;
    phone: string;
    username: string;
}

const sessionSecret:string = process.env["SESSION_SECRET "] || 'bojinhong';

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: process.env["COOKIE_NAME "] || 'RSESSIONID',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionSecret],
        secure: process.env.NODE_ENV === 'production',
    }
})

export const auth = new Authenticator<LoginedUser>(sessionStorage);

auth.use(
    new FormStrategy<LoginedUser>(async ({form}) => {
        const data = {username: form.get("username"), password: form.get("password"), captcha: form.get("captcha"), checkKey: form.get("checkKey")};
        if(_.isEmpty(data.username) || _.isEmpty(data.password)) {
            throw new AuthorizationError('username or password is required');
        }
        const res = await fetch(API_LOGIN, postFormInit(JSON.stringify(data)));
        const result = await res.json();
        if(result.code !== 200) {
            throw new AuthorizationError(result?.message || 'login fail');
        }
        return {token: result.result.token, userInfo: result.result.userInfo};
    })
)

export const requireAuthenticated = async (request: Request) => {
    return await auth.isAuthenticated(request, {failureRedirect: LOGIN_URL});
}

export const logout = async (request: Request) => {
    return await auth.logout(request, {redirectTo: LOGIN_URL});
}