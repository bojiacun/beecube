import type { MetaFunction, LinksFunction } from "@remix-run/node";
import React, {useState} from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import ThemeContext, {theme, themeBreakpoints, themeColors} from 'themeConfig';
import featherStyleUrl from '~/styles/fonts/feather/iconfont.css';
import coreStyleUrl from '~/styles/core.css';
import stylesUrl from '~/styles/styles.css';
import loaderStyleUrl from '~/styles/loader.css';
import i18n from '~/libs/i18n/index';
import ScrollToTop from "~/components/scroll-to-top/ScrollToTop";
import logoSvg from 'assets/images/logo/logo.svg';
import {Image} from "react-bootstrap";

i18n.changeLanguage('cn').then();


export const links: LinksFunction = () => {
  return [
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

  return (
    <html lang="cn">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={themeContext.layout.skin == 'dark' ? 'dark-layout':''} style={{overflowY: themeContext.layout.iframeContent ? 'hidden': 'auto'}}>
        <ThemeContext.Provider value={{theme: themeContext, setThemeContext}}>
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
            <Outlet />
            {themeContext.layout.enableScrollToTop && <ScrollToTop />}
          </div>
        </ThemeContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
