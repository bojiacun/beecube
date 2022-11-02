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
import ThemeContext, {theme} from 'themeConfig';
import featherStyleUrl from '~/styles/fonts/feather/iconfont.css';
import coreStyleUrl from '~/styles/core.css';
import stylesUrl from '~/styles/styles.css';
//@ts-ignore
import config from 'react-reveal/globals';
import '~/libs/i18n/index';

config({ssrFadeout: true});

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: featherStyleUrl},
    {rel: 'stylesheet', href: coreStyleUrl},
    {rel: 'stylesheet', href: stylesUrl},
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "蜜蜂魔方",
  viewport: "width=device-width,initial-scale=1",
});


export default function App() {
  const [themeContext, setThemeContext] = useState(theme);

  return (
    <html lang="zh">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeContext.Provider value={{theme: themeContext, setThemeContext}}>
          <div id='app' className='h-100'>
            <Outlet />
          </div>
        </ThemeContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
