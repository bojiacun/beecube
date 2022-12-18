import type {MetaFunction, LinksFunction, LoaderFunction} from "@remix-run/node";
import React, {CSSProperties, useEffect, useState} from 'react';
import {
    Links,
    LiveReload,
    Meta,
    Scripts,
    ScrollRestoration, useCatch, useLoaderData, useNavigate, useOutlet,
} from "@remix-run/react";
import ThemeContext, {theme, themeBreakpoints, themeColors} from 'themeConfig';
import featherStyleUrl from '~/styles/fonts/feather/iconfont.css';
import coreStyleUrl from '~/styles/core.css';
import stylesUrl from '~/styles/styles.css';
import loaderStyleUrl from '~/styles/loader.css';
import i18n from '~/libs/i18n/index';
import LayoutVertical, {links as layoutVerticalLinks} from "~/layouts/layout-vertical/LayoutVertical";
import LayoutFull from "~/layouts/layout-full/LayoutFull";
//@ts-ignore
import _ from 'lodash';
import {json} from "@remix-run/node";
import {AnimatePresence, motion} from "framer-motion";
import {useLocation} from "react-router";
import reactBootstrapTable2Style from 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import datepickerStyle from 'react-datepicker/dist/react-datepicker.min.css';
import toastStyle from 'react-toastify/dist/ReactToastify.min.css';
import zhCN from 'date-fns/locale/zh-CN';
import {registerLocale, setDefaultLocale} from "react-datepicker";
import {ToastContainer} from "react-toastify";
import Error500Page from "~/components/error-page/500";
import Error404Page from "~/components/error-page/404";
import Error401Page from "~/components/error-page/401";
import pageMiscStyle from '~/styles/react/pages/page-misc.css';
import ClipLoader from "react-spinners/ClipLoader";

//字体设置
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons';
import {requireAuthenticated} from "~/utils/auth.server";
library.add(fas, far);


registerLocale('zh-cn', zhCN);
setDefaultLocale('zh-cn');

i18n.changeLanguage('cn').then();


export async function loader({request}:any) {
    let userInfo = await requireAuthenticated(request, false);
    //处理用户菜单，过滤非系统菜单
    if(userInfo) {
        // userInfo!.perms = userInfo!.perms!.filter((p:any)=>p.componentName == 'index');
    }

    return json({
        userInfo: userInfo,
        ENV: {
            BASE_URL: process.env.BASE_URL,
            LOGIN_SUCCESS_URL: process.env.LOGIN_SUCCESS_URL,
            LOGIN_URL: process.env.LOGIN_URL,
            LOGOUT_URL: process.env.LOGOUT_URL,
            USER_INFO_URL: process.env.USER_INFO_URL,
        },
    });
}

export const links: LinksFunction = () => {
    return [
        ...layoutVerticalLinks(),
        {rel: 'stylesheet', href: featherStyleUrl},
        {rel: 'stylesheet', href: coreStyleUrl},
        {rel: 'stylesheet', href: stylesUrl},
        {rel: 'stylesheet', href: loaderStyleUrl},
        {rel: 'stylesheet', href: reactBootstrapTable2Style},
        {rel: 'stylesheet', href: datepickerStyle},
        {rel: 'stylesheet', href: toastStyle},
        {rel: 'stylesheet', href: pageMiscStyle},
    ];
}

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "蜜蜂魔方",
    viewport: "width=device-width,initial-scale=1",
});

export function ErrorBoundary({error}: { error: Error }) {
    const [themeContext, setThemeContext] = useState(theme);
    return (
        <html lang="cn">
        <head>
            <Meta/>
            <Links/>
        </head>
        <body className={themeContext?.layout?.skin == 'dark' ? 'dark-layout' : ''} style={{overflowY: 'auto'}}>
        <div id='app' className='h-100 d-flex align-items-center justify-content-center'>
            <Error500Page />
        </div>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}

export function CatchBoundary() {
    const [themeContext, setThemeContext] = useState(theme);
    const caught = useCatch();
    const data = useLoaderData();
    if (caught.status === 401) {
        //登录态失效
        return (
            <html lang="cn">
            <head>
                <Meta/>
                <Links/>
            </head>
            <body className={themeContext?.layout?.skin == 'dark' ? 'dark-layout' : ''} style={{overflowY: 'auto'}}>
            <div id='app' className='h-100 d-flex align-items-center justify-content-center'>
                <Error401Page />
            </div>
            <ScrollRestoration/>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.ENV = ${JSON.stringify(
                        data.ENV
                    )}`,
                }}
            />
            <Scripts/>
            <LiveReload/>
            </body>
            </html>
        );
    }
    else if(caught.status === 404) {
        return (
            <html lang="cn">
            <head>
                <Meta/>
                <Links/>
            </head>
            <body className={themeContext?.layout?.skin == 'dark' ? 'dark-layout' : ''} style={{overflowY: 'auto'}}>
            <div id='app' className='h-100 d-flex align-items-center justify-content-center'>
                <Error404Page />
            </div>
            <ScrollRestoration/>
            <Scripts/>
            <LiveReload/>
            </body>
            </html>
        );
    }
    throw new Error('未捕获的异常信息');
}
const loaderCss: CSSProperties = {
    position: "absolute",
    left: 'calc(50% - 17.5px)',
    top: 'calc(50% - 17.5px)',
    zIndex: '999999'
};
export default function App() {
    const [themeContext, setThemeContext] = useState(theme);
    const navigate = useNavigate();
    const location = useLocation();
    const data = useLoaderData();
    const [loading, setLoading] = useState(false);
    const outlet = useOutlet();

    const startPageLoading = () => {
        setLoading(true);
    }
    const stopPageLoading = () => {
        setLoading(false);
    }
    const excludeAdminPaths = ['/login', '/console'];

    let Layout: any;
    if (_.indexOf(excludeAdminPaths, location.pathname) > -1) {
        Layout = LayoutFull;
    } else {
        Layout = LayoutVertical;
    }

    useEffect(() => {
        //@ts-ignore
        window.theme = theme;
        //@ts-ignore
        window.navigate = navigate;
    }, []);

    useEffect(() => {
        // startPageLoading();
    }, [location.pathname]);


    // 设置主题颜色
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
        themeColors[colors[i]] = `--${colors[i]}`.trim();
    }
    // 设置主题断点
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
        themeBreakpoints[breakpoints[i]] = `--breakpoint-${breakpoints[i]}`;
    }

    const updateThemeContext = (theme: any) => {
        setThemeContext(theme);
        //@ts-ignore
        window.theme = theme;
    }


    return (
        <html lang="cn">
        <head>
            <Meta/>
            <Links/>
        </head>
        <body className={themeContext?.layout?.skin == 'dark' ? 'dark-layout' : ''} style={{overflowY: 'auto'}}>
        <ThemeContext.Provider value={{theme: themeContext, updateThemeContext, startPageLoading, stopPageLoading}}>
            <div id='app' className='h-100'>
                <Layout startPageLoading={startPageLoading} stopPageLoading={stopPageLoading}>
                    <AnimatePresence mode={'wait'} initial={false}>
                        <motion.div
                            key={location.pathname}
                            initial={{scale: 0, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0, opacity: 0}}
                        >
                            {outlet}
                        </motion.div>
                    </AnimatePresence>
                </Layout>
                <ClipLoader
                    color={'#3366CC'}
                    loading={loading}
                    cssOverride={loaderCss}
                />
            </div>
        </ThemeContext.Provider>
        <ScrollRestoration/>
        <script
            dangerouslySetInnerHTML={{
                __html: `window.ENV = ${JSON.stringify(
                    data.ENV
                )}`,
            }}
        />
        <ToastContainer />
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
