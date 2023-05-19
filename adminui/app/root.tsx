import type {MetaFunction, LinksFunction, LoaderFunction} from "@remix-run/node";
import React, {CSSProperties, FC, useEffect, useState} from 'react';
import {
    isRouteErrorResponse,
    Links,
    LiveReload,
    Meta,
    Scripts,
    ScrollRestoration, useCatch, useLoaderData, useMatches, useOutlet, useRouteError,
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
import {json, V2_MetaFunction} from "@remix-run/node";
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
import {sessionStorage} from "~/utils/auth.server";
//字体设置
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons';
import {requireAuthenticated} from "~/utils/auth.server";
import ServerEnv from "~/env";
import {setLocale} from "yup";

setLocale({
    number: {
        integer: '必须是整数',
    },
    mixed: {
        notType: '请输入正确的内容',
    }
})
library.add(fas, far);

registerLocale('zh-cn', zhCN);
setDefaultLocale('zh-cn');

i18n.changeLanguage('cn').then();


export async function loader({request}:any) {
    let userInfo = await requireAuthenticated(request, false);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    //处理用户菜单，过滤非系统菜单
    if(userInfo) {
        if(session.has("APPID")) {
            //如果有APPID，则说明要进去应用控制台
            userInfo.perms = session.get("APP_MENUS");
        }
        else {
            userInfo.perms = userInfo.perms?.filter((p:any)=>!p.componentName || (p.header && p.componentName=='app'));
        }
    }
    return json({
        userInfo: userInfo,
        from: session.get("FROM"),
        app: session.get("APP"),
        ENV: ServerEnv,
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

export const meta: V2_MetaFunction = () => {
    return [{
        charset: "utf-8",
        title: "蜜蜂魔方",
        viewport: "width=device-width,initial-scale=1",
    }];
}
const Document:FC<any> = (props) => {
    const data = useLoaderData();
    const [themeContext, setThemeContext] = useState(theme);
    return (
        <html lang="cn">
        <head>
            <Meta/>
            <Links/>
        </head>
        <body className={themeContext?.layout?.skin == 'dark' ? 'dark-layout' : ''} style={{overflowY: 'auto'}}>
        {props.children}
        <ScrollRestoration/>
        <script
            dangerouslySetInnerHTML={{
                __html: `window.ENV = ${JSON.stringify(
                    data?.ENV
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
export function ErrorBoundary() {
    const [themeContext, setThemeContext] = useState(theme);
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 401:
                return (
                    <Document>
                        <div id='app' className='h-100 d-flex align-items-center justify-content-center'>
                            <Error401Page />
                        </div>
                    </Document>
                );
            case 404:
                return (
                    <Document>
                        <div id='app' className='h-100 d-flex align-items-center justify-content-center'>
                            <Error404Page />
                        </div>
                    </Document>
                );
        }
    }
    return (
        <Document>
            <div id='app' className='h-100 d-flex align-items-center justify-content-center'>
                <Error500Page />
            </div>
        </Document>
    );
}

const loaderCss: CSSProperties = {
    position: "absolute",
    left: 'calc(50% - 17.5px)',
    top: 'calc(50% - 17.5px)',
    zIndex: '999999'
};

export default function App() {
    const data = useLoaderData();
    theme.userInfo = data.userInfo;
    const [themeContext, setThemeContext] = useState(theme);
    const matches = useMatches();
    const [loading, setLoading] = useState(false);
    const outlet = useOutlet();

    const startPageLoading = () => {
        setLoading(true);
    }
    const stopPageLoading = () => {
        setLoading(false);
    }
    const excludeAdminPaths = ['/login', '/console','/app/diy'];

    let Layout: any;
    if (_.indexOf(excludeAdminPaths, matches[matches.length-1].pathname) > -1) {
        Layout = LayoutFull;
    } else {
        Layout = LayoutVertical;
    }

    useEffect(() => {
        //@ts-ignore
        window.theme = theme;
        //@ts-ignore
        // window.navigate = navigation;
    }, []);


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
        <Document>
            <ThemeContext.Provider value={{theme: themeContext, updateThemeContext, startPageLoading, stopPageLoading, pageLoading: loading}}>
                <div id='app' className='h-100'>
                    <Layout startPageLoading={startPageLoading} stopPageLoading={stopPageLoading}>
                        {outlet}
                    </Layout>
                    <ClipLoader
                        color={'#3366CC'}
                        loading={loading}
                        cssOverride={loaderCss}
                    />
                </div>
            </ThemeContext.Provider>
        </Document>
    );
}
