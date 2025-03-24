/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */
import * as React from 'react';
(global as any).__CLIENT__ = false;
(global as any).__SERVER__ = true;
import { PassThrough, Transform } from 'node:stream';
import type { EntryContext } from '@remix-run/node';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider } from '@common-stack/components-pro';
import { InversifyProvider } from '@common-stack/client-react';
import { renderToPipeableStream } from 'react-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import { LOCATION_CHANGE } from '@common-stack/remix-router-redux';
import serialize from 'serialize-javascript';
import { createCache as createAntdCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { CacheProvider } from '@emotion/react';
import { renderStylesToNodeStream } from '@emotion/server';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
// @ts-ignore
import { i18nextInstance as i18next } from '@app/frontend-stack-react/i18n-localization/i18next.server.js';
import config from '@app/cde-webconfig.json';
// @ts-ignore
import createEmotionCache from '@app/frontend-stack-react/entries/common/createEmotionCache';
import type { IAppLoadContext } from '@common-stack/client-core';

const ABORT_DELAY = 5_000;
const antdCache = createAntdCache();
const cache = createEmotionCache();

class ConstantsTransform extends Transform {
    _fills: string[];
    _apolloState: any;
    _reduxState: any;
    _styleSheet: string;

    constructor(fills: string[], apolloState: any, reduxState: any, styleSheet: any) {
        super();
        this._fills = fills;
        this._apolloState = apolloState;
        this._reduxState = reduxState;
        this._styleSheet = styleSheet;
    }

    _transform(chunk, encoding, callback) {
        let transformedChunk = chunk.toString();

        if (transformedChunk.includes('[__APOLLO_STATE__]')) {
            transformedChunk = transformedChunk.replace(
                '[__APOLLO_STATE__]',
                serialize(this._apolloState, { isJSON: true }),
            );
        }
        if (transformedChunk.includes('[__PRELOADED_STATE__]')) {
            transformedChunk = transformedChunk.replace(
                '[__PRELOADED_STATE__]',
                serialize(this._reduxState, { isJSON: true }),
            );
        }
        if (transformedChunk.includes('[__SLOT_FILLS__]')) {
            transformedChunk = transformedChunk.replace('[__SLOT_FILLS__]', serialize(this._fills, { isJSON: true }));
        }
        if (transformedChunk.includes('[__STYLESHEET__]')) {
            transformedChunk = transformedChunk.replace('[__STYLESHEET__]', this._styleSheet);
        }

        callback(null, transformedChunk);
    }
}

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    // This is ignored so we can keep it in the template for visibility.  Feel
    // free to delete this parameter in your app if you're not using it!
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadContext: IAppLoadContext,
) {
    const instance = createInstance();
    const lng = await i18next.getLocale(request);
    const ns = i18next.getRouteNamespaces(remixContext);

    // First, we create a new instance of i18next so every request will have a
    // completely unique instance and not share any state.
    if (config.i18n.enabled) {
        await instance
            .use(initReactI18next) // Tell our instance to use react-i18next
            .use(Backend) // Setup our backend.init({
            .init({
                fallbackLng: config.i18n.fallbackLng,
                defaultNS: config.i18n.defaultNS,
                react: config.i18n.react,
                supportedLngs: config.i18n.supportedLngs,
                lng, // The locale we detected above
                ns, // The namespaces the routes about to render want to use
                backend: {
                    loadPath: resolve(config.i18n.backend.loadServerPath),
                },
            });
    }

    return isbot(request.headers.get('user-agent') || '')
        ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext, instance)
        : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext, instance);
}

function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    loadContext: IAppLoadContext,
    i18nInstance: i18next,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const { pipe, abort } = renderToPipeableStream(
            <I18nextProvider i18n={i18nInstance}>
                <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
            </I18nextProvider>,
            {
                onAllReady() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        }),
                    );

                    pipe(body);
                },
                onShellError(error: unknown) {
                    reject(error);
                },
                onError(error: unknown) {
                    responseStatusCode = 500;
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            },
        );

        setTimeout(abort, ABORT_DELAY);
    });
}

function handleBrowserRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    loadContext: IAppLoadContext,
    i18nInstance: i18next,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const slotFillContext = { fills: {} };
        const { modules: clientModules, container, apolloClient: client, store } = loadContext;

        const { pathname, search, hash } = new URL(request.url);
        store.dispatch({
            type: LOCATION_CHANGE,
            payload: { location: { pathname, search, hash }, action: 'POP' },
        });

        const { pipe, abort } = renderToPipeableStream(
            (
                <I18nextProvider i18n={i18nInstance}>
                    <CacheProvider value={cache}>
                        <StyleProvider cache={antdCache}>
                            <ReduxProvider store={store}>
                                <SlotFillProvider context={slotFillContext}>
                                    <InversifyProvider container={container} modules={clientModules as any}>
                                        <ApolloProvider client={client}>
                                            <RemixServer
                                                context={remixContext}
                                                url={request.url}
                                                abortDelay={ABORT_DELAY}
                                            />
                                        </ApolloProvider>
                                    </InversifyProvider>
                                </SlotFillProvider>
                            </ReduxProvider>
                        </StyleProvider>
                    </CacheProvider>
                </I18nextProvider>
            ) as any,
            {
                onShellReady() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);
                    const apolloState = { ...client.extract() };
                    const reduxState = { ...store.getState() };
                    const fills = Object.keys(slotFillContext.fills);
                    const styleSheet = extractStyle(antdCache);

                    const transform = new ConstantsTransform(fills, apolloState, reduxState, styleSheet);

                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        }),
                    );

                    pipe(transform).pipe(renderStylesToNodeStream()).pipe(body);
                },
                onShellError(error: unknown) {
                    reject(error);
                },
                onError(error: unknown) {
                    responseStatusCode = 500;
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error);
                    }
                    reject(error);
                },
            },
        );

        setTimeout(abort, ABORT_DELAY);
    });
}
