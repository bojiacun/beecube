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

import themeConfig from 'themeConfig';

import featherStyleUrl from '~/styles/fonts/feather/iconfont.css';
import coreStyleUrl from '~/styles/core.css';
import stylesUrl from '~/styles/styles.css';

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

const ThemeContext = React.createContext<any>(themeConfig);


export default function App() {
  const [themeContext, setThemeContext] = useState(themeConfig);
  return (
    <html lang="zh">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeContext.Provider value={{theme: themeContext, setThemeContext}}>
          <Outlet />
        </ThemeContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
