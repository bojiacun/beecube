import type { MetaFunction, LinksFunction } from "@remix-run/node";
import React, {useEffect, useState} from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData, useNavigate, useOutlet, useTransition,
} from "@remix-run/react";
import ThemeContext, {theme, themeBreakpoints, themeColors} from 'themeConfig';
import featherStyleUrl from '~/styles/fonts/feather/iconfont.css';
import coreStyleUrl from '~/styles/core.css';
import stylesUrl from '~/styles/styles.css';
import loaderStyleUrl from '~/styles/loader.css';
import i18n from '~/libs/i18n/index';
import logoSvg from 'assets/images/logo/logo.svg';
import {Image} from "react-bootstrap";
import LayoutVertical, {links as layoutVerticalLinks} from "~/layouts/layout-vertical/LayoutVertical";
import LayoutFull from "~/layouts/layout-full/LayoutFull";
//@ts-ignore
import _ from 'lodash';
import {json} from "@remix-run/node";
import {AnimatePresence, motion} from "framer-motion";
import {useLocation} from "react-router";
import {startPageLoading} from "~/layouts/utils";

i18n.changeLanguage('cn').then();


export async function loader() {
  return json({
    ENV: {
      BASE_URL: process.env.BASE_URL,
      LOGIN_SUCCESS_URL: process.env.LOGIN_SUCCESS_URL,
      LOGIN_URL: process.env.LOGIN_URL,
      LOGOUT_URL: process.env.LOGOUT_URL,
      USER_INFO_URL: process.env.USER_INFO_URL,
      SESSION_SECRET: process.env.SESSION_SECRET,
      COOKIE_NAME: process.env.COOKIE_NAME,
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
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "蜜蜂魔方",
  viewport: "width=device-width,initial-scale=1",
});


export default function App() {
  const [themeContext, setThemeContext] = useState(theme);
  const navigate = useNavigate();
  const location = useLocation();
  const data = useLoaderData();
  const outlet = useOutlet();



  const excludeAdminPaths = ['/login'];

  let Layout : any;
  if(_.indexOf(excludeAdminPaths,location.pathname) > -1) {
    Layout = LayoutFull;
  }
  else {
    Layout = LayoutVertical;
  }

  useEffect(()=>{
    //@ts-ignore
    window.theme = theme;
    //@ts-ignore
    window.navigate = navigate;
  }, []);

  useEffect(()=> {
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

  const updateThemeContext = (theme:any) => {
    setThemeContext(theme);
    //@ts-ignore
    window.theme = theme;
  }



  return (
    <html lang="cn">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={themeContext?.layout?.skin == 'dark' ? 'dark-layout':''} style={{overflowY: 'auto'}}>
        <ThemeContext.Provider value={{theme: themeContext, updateThemeContext}}>
          <div id="loading-bg">
            <div className="loading-logo">
              <Image src={logoSvg} width={70} height={70} />
            </div>
            <div className="loading">
              <div className="effect-1 effects"></div>
              <div className="effect-2 effects"></div>
              <div className="effect-3 effects"></div>
            </div>
          </div>
          <div id='app' className='h-100'>
            <Layout>
              <AnimatePresence mode={'wait'} initial={false}>
                <motion.div
                    key={location.pathname}
                    initial={{  opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                  {outlet}
                </motion.div>
              </AnimatePresence>
            </Layout>
          </div>
        </ThemeContext.Provider>
        <ScrollRestoration />
        <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(
                  data.ENV
              )}`,
            }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
