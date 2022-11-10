import {createCookieSessionStorage} from "@remix-run/node";
import {Authenticator, AuthorizationError} from "remix-auth";
import {FormStrategy} from "remix-auth-form";
//@ts-ignore
import _ from 'lodash';
import {API_LOGIN, LOGIN_URL, postFormInit} from "~/utils/request.server";

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

export const auth = new Authenticator(sessionStorage);

auth.use(
    new FormStrategy(async ({form}) => {
        const data = {username: form.get("username"), password: form.get("password"), captcha: form.get("captcha"), checkKey: form.get("checkKey")};
        if(_.isEmpty(data.username) || _.isEmpty(data.password)) {
            throw new AuthorizationError('username or password is required');
        }
        const res = await fetch(API_LOGIN, postFormInit(JSON.stringify(data)));
        const result = await res.json();
        if(result.code !== 200) {
            throw new AuthorizationError(result?.message || 'login fail');
        }
        return result.data;
    })
)

export const requireAuthenticated = async (request: Request) => {
    return await auth.isAuthenticated(request, {failureRedirect: LOGIN_URL});
}