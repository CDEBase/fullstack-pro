import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ErrorBoundary } from './app/ErrorBoundary';
import { MainRoute } from './modules';
import { PluginArea } from '@common-stack/client-react';

export function Layout({ children }: { children: React.ReactNode }) {
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
        <script>window.__ENV__=[__ENV__]</script>
        <script>window.__APOLLO_STATE__=[__APOLLO_STATE__]</script>
        <script>window.__PRELOADED_STATE__=[__PRELOADED_STATE__]</script>
        <script>window.__SLOT_FILLS__=[__SLOT_FILLS__]</script>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MainRoute>
      <Outlet />
    </MainRoute>
  );
}

export { ErrorBoundary }
