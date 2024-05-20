import * as React from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { json } from '@remix-run/react';
import publicEnv from './config/public-config';
import { PluginArea } from '@common-stack/client-react';
import { subscribeReduxRouter } from '@common-stack/remix-router-redux';
import { ApplicationErrorHandler } from '@admin-layout/ant-ui';
import { ConfigProvider } from 'antd';
import { plugins } from './modules/module';
import { ErrorBoundary } from './app/ErrorBoundary';

export const loader = async () => {
  return json({
    __ENV__: publicEnv,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData();

  React.useEffect(() => {
    subscribeReduxRouter({store: window.__remixStore, router: window.__remixRouter} as any);
  }, []);

  const getConstants = () => {
    if (typeof window === 'undefined') {
      return (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__ENV__ = ${JSON.stringify(data?.__ENV__)}`,
            }}
          />
          <script>window.__APOLLO_STATE__=[__APOLLO_STATE__]</script>
          <script>window.__PRELOADED_STATE__=[__PRELOADED_STATE__]</script>
          <script>window.__SLOT_FILLS__=[__SLOT_FILLS__]</script>
          <script
            dangerouslySetInnerHTML={{
              __html: `if (global === undefined) { var global = window; }`,
            }}
          />
        </>
      );
    }
    return null;
  }
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {(typeof window === 'undefined') ? `[__STYLESHEET__]` : ''}
      </head>
      <body>
        <PluginArea />
        {children}
        <ScrollRestoration />
        <Scripts />
        {getConstants()}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ApplicationErrorHandler plugins={plugins}>
      <ConfigProvider>
        <Outlet />
      </ConfigProvider>
    </ApplicationErrorHandler>
  );
}

export { ErrorBoundary }
