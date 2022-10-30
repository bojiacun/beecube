import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import coreStyleUrl from '~/styles/core.css';

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: coreStyleUrl}
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "蜜蜂魔方",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="zh">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
