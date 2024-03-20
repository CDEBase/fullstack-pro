import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
// import { Layout, ConfigProvider } from 'antd';
// import counterModules from '@sample-stack/counter-module-browser';
// import { Feature, FeatureWithRouterFactory, renderRoutes2 } from '@common-stack/client-react';
// import { SiderMenu } from './modules/layout';
export { ErrorBoundary } from './app/ErrorBoundary';
// import '@sample-stack/assets';

// const features = new Feature(FeatureWithRouterFactory, counterModules);
// const configuredRoutes = features.getConfiguredRoutes2();
// export const routes = renderRoutes2({
//   routes: configuredRoutes,
//   withRoutesElement: true,
//   isServer: __SERVER__,
// });
// console.log(routes);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    
    <Outlet />
           
  );
}
