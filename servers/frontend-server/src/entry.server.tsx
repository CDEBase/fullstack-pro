/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */
import 'reflect-metadata';
global.__CLIENT__ = false;
global.__SERVER__ = true;
console.log('---STARRRR');
import { PassThrough } from 'node:stream';
import type { AppLoadContext, EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { isbot } from 'isbot';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider, replaceServerFills } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { renderToPipeableStream } from 'react-dom/server';
import { Provider as ReduxProvider } from 'react-redux';

import createEmotionCache from './common/createEmotionCache';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';
import clientModules from './modules/module';
const ABORT_DELAY = 5_000;



export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    // This is ignored so we can keep it in the template for visibility.  Feel
    // free to delete this parameter in your app if you're not using it!
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadContext: AppLoadContext,
) {
    return isbot(request.headers.get('user-agent') || '')
        ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext)
        : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}

function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const emotionCache = createEmotionCache();
        const { container, serviceFunc, logger, apolloClient: client } = createClientContainer(request);
        const services = serviceFunc();
        const { store } = createReduxStore(client, services, container);
        let slotFillContext = { fills: {} };
        const { pipe, abort } = renderToPipeableStream(
            <EmotionCacheProvider value={emotionCache}>
                <SlotFillProvider context={slotFillContext}>
                    <ReduxProvider store={store}>
                        <InversifyProvider container={container} modules={clientModules}>
                            {clientModules.getWrappedRoot(
                                <ApolloProvider client={client}>
                                    <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
                                </ApolloProvider>,
                                request,
                            )}
                        </InversifyProvider>
                    </ReduxProvider>
                </SlotFillProvider>
                ,
            </EmotionCacheProvider>,
            {
                onAllReady() {
                    shellRendered = true;
                    const reactBody = new PassThrough();
                    const emotionServer = createEmotionServer(emotionCache);
                    const bodyWithStyles = emotionServer.renderStylesToNodeStream();

                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(bodyWithStyles, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        }),
                    );

                    pipe(reactBody);
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
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const emotionCache = createEmotionCache();
        const { container, serviceFunc, logger, apolloClient: client } = createClientContainer(request);
        const services = serviceFunc();
        const { store } = createReduxStore(client, services, container);
        let slotFillContext = { fills: {} };
        const { pipe, abort } = renderToPipeableStream(
            <EmotionCacheProvider value={emotionCache}>
                <SlotFillProvider context={slotFillContext}>
                    <ReduxProvider store={store}>
                        <InversifyProvider container={container} modules={clientModules}>
                            {clientModules.getWrappedRoot(
                                <ApolloProvider client={client}>
                                    <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
                                </ApolloProvider>,
                                request,
                            )}
                        </InversifyProvider>
                    </ReduxProvider>
                </SlotFillProvider>
            </EmotionCacheProvider>,
            {
                onShellReady() {
                    shellRendered = true;
                    const reactBody = new PassThrough();
                    const emotionServer = createEmotionServer(emotionCache);

                    const bodyWithStyles = emotionServer.renderStylesToNodeStream();
                    reactBody.pipe(bodyWithStyles);

                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(bodyWithStyles, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        }),
                    );

                    pipe(reactBody);
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
