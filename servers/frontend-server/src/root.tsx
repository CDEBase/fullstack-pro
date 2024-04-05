import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { PluginArea } from '@common-stack/client-react';
import publicEnv from './config/public-config';
import { ErrorBoundary } from './app/ErrorBoundary';

export function loader() {
  return json({
      __ENV__: publicEnv,
  });
}


export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <PluginArea />
                {children}
                <ScrollRestoration />
                <Scripts />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__ENV__ = ${JSON.stringify(data.__ENV__)}`,
                    }}
                />
                {/* <script>window.__APOLLO_STATE__=[__APOLLO_STATE__]</script>
                <script>window.__PRELOADED_STATE__=[__PRELOADED_STATE__]</script>
                <script>window.__SLOT_FILLS__=[__SLOT_FILLS__]</script> */}
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export { ErrorBoundary };
