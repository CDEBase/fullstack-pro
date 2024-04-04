import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ErrorBoundary } from './app/ErrorBoundary';
import counterModules from '@sample-stack/counter-module-browser';
import { Feature, FeatureWithRouterFactory, PluginArea } from '@common-stack/client-react';

export const loader = async () => {
  const features = new Feature(FeatureWithRouterFactory, counterModules);
  return { menuData: features.getMenus() };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const envScript = `window.__ENV__ = ${JSON.stringify(publicEnv)}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        __STYLESHEET__
      </head>
      <body>
        <PluginArea />
        {children}
        <ScrollRestoration />
        <Scripts />
        <script dangerouslySetInnerHTML={{ __html: envScript }} />
        <script>window.__APOLLO_STATE__=[__APOLLO_STATE__]</script>
        <script>window.__PRELOADED_STATE__=[__PRELOADED_STATE__]</script>
        <script>window.__SLOT_FILLS__=[__SLOT_FILLS__]</script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export { ErrorBoundary }
