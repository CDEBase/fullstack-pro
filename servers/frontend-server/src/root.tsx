import 'reflect-metadata';
import * as React from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError, json } from '@remix-run/react';
// @ts-ignore
import publicEnv from '@src/config/public-config';
import { PluginArea } from '@common-stack/client-react';
import { subscribeReduxRouter } from '@common-stack/remix-router-redux';
import { ApplicationErrorHandler } from '@admin-layout/ant-ui';
import { ConfigProvider } from 'antd';
// @ts-ignore
import clientModules, { plugins } from '@app/frontend-stack-react/modules.js';
// @ts-ignore
import { useChangeLanguage } from 'remix-i18next/react';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import { i18nextInstance as i18next } from '@app/frontend-stack-react/i18n-localization/i18next.server.js';
// @ts-ignore
import { ErrorBoundary } from '@app/frontend-stack-react/entries/antui/components/ErrorBoundary';

export const loader = async ({ request }) => {
    const locale = await i18next.getLocale(request);
    return json({
        __ENV__: publicEnv,
        locale,
    });
};

export const handle = {
    i18n: 'common',
};

export function shouldRevalidate(params: any) {
    return params.defaultShouldRevalidate && params.currentUrl.pathname !== params.nextUrl.pathname;
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData<{ locale: any }>();
    const locale = data?.locale;

    const { i18n } = useTranslation();

    useChangeLanguage(locale);

    React.useEffect(() => {
        subscribeReduxRouter({ store: (window as any).__remixStore, router: window.__remixRouter } as any);
    }, []);

    const getConstants = () => {
        if (typeof window === 'undefined') {
            return (
                <>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.__ENV__ = ${JSON.stringify((data as any)?.__ENV__)}`,
                        }}
                    />
                    <script
                        src="https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect.min.js"
                        integrity="sha512-jvbPH2TH5BSZumEfOJZn9IV+5bSwwN+qG4dvthYe3KCGC3/9HmxZ4phADbt9Pfcp+XSyyfc2vGZ/RMsSUZ9tbQ=="
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                    ></script>
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
    };

    return (
        <html lang={locale} dir={i18n.dir()}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                {typeof window === 'undefined' ? `[__STYLESHEET__]` : ''}
            </head>
            <body>
                <PluginArea />
                {clientModules.getWrappedRoot(children)}
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

export { ErrorBoundary };
