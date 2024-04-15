import * as React from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { PluginArea } from '@common-stack/client-react';
import { subscribeReduxRouter } from '@common-stack/remix-router-redux';
import { Box } from '@chakra-ui/react';
import { ApplicationErrorHandler } from '@admin-layout/chakra-ui';
import publicEnv from './config/public-config';
import { ErrorBoundary } from './app/ErrorBoundary';
import { registeredPlugins } from './modules/module';

export function loader() {
    return json({
        __ENV__: publicEnv,
    });
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData();
    
    React.useLayoutEffect(() => {
        subscribeReduxRouter({store: window.__remixStore, router: window.__remixRouter} as any);
    }, []);
    
    const getConstants = () => {
        if (typeof window === 'undefined') {
            return (
                <>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.__ENV__ = ${JSON.stringify(data.__ENV__)}`,
                        }}
                    />
                    <script>window.__APOLLO_STATE__=[__APOLLO_STATE__]</script>
                    <script>window.__PRELOADED_STATE__=[__PRELOADED_STATE__]</script>
                    <script>window.__SLOT_FILLS__=[__SLOT_FILLS__]</script>
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
        <ApplicationErrorHandler plugins={registeredPlugins}>
            <Box display="flex" flexDir="column" minH="100vh">
                <Box flex="1">
                    <Outlet />
                </Box>
            </Box>
        </ApplicationErrorHandler>
    );
}

export { ErrorBoundary };
