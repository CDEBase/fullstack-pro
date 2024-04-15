/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */
import 'reflect-metadata';
global.__CLIENT__ = false;
global.__SERVER__ = true;
import { PassThrough, Transform } from 'node:stream';
import type { AppLoadContext, EntryContext } from '@remix-run/node';
import { createReadableStreamFromReadable } from "@remix-run/node";
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
import serialize from 'serialize-javascript';
import createEmotionCache from './common/createEmotionCache';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';
// import clientModules from './modules/module';
const ABORT_DELAY = 5_000;

class ConstantsTransform extends Transform {
    _fills: string[];
    _apolloState: any;
    _reduxState: any;

    constructor(fills: string[], apolloState: any, reduxState: any) {
        super();
        this._fills = fills;
        this._apolloState = apolloState;
        this._reduxState = reduxState;
    }

    _transform(chunk, encoding, callback) {
        let transformedChunk = chunk.toString();
    
        if (transformedChunk.includes('[__APOLLO_STATE__]')) {
            transformedChunk = transformedChunk.replace('[__APOLLO_STATE__]', serialize(this._apolloState, { isJSON: true }));
        } 
        if (transformedChunk.includes('[__PRELOADED_STATE__]')) {
            transformedChunk = transformedChunk.replace('[__PRELOADED_STATE__]', serialize(this._reduxState, { isJSON: true }));
        }
        if (transformedChunk.includes('[__SLOT_FILLS__]')) {
            transformedChunk = transformedChunk.replace('[__SLOT_FILLS__]', serialize(this._fills, { isJSON: true }));
        }
        
        callback(null, transformedChunk);
    }
}

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
        ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext)
        : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext);
}

function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    loadContext: AppLoadContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const { pipe, abort } = renderToPipeableStream(
            <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />,
            {
                onAllReady() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
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
    loadContext: AppLoadContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const emotionCache = createEmotionCache();
        let slotFillContext = { fills: {} };
        const { module: clientModules, container, apolloClient: client, store }: 
            AppLoadContext & { clientModules?: any, container?: any, client?: any, store?: any } = loadContext;
        const { pipe, abort } = renderToPipeableStream(
            <EmotionCacheProvider value={emotionCache}>
                <SlotFillProvider context={slotFillContext}>
                    <ReduxProvider store={store}>
                        <InversifyProvider container={container} modules={clientModules}>
                            <ApolloProvider client={client}>
                                <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
                            </ApolloProvider>
                        </InversifyProvider>
                    </ReduxProvider>
                </SlotFillProvider>
            </EmotionCacheProvider>,
            {
                onShellReady() {
                    shellRendered = true;
                    let body = new PassThrough();

                    const apolloState = {...client.extract()};
                    const reduxState = {...store.getState()};
                    const fills = Object.keys(slotFillContext.fills);
                    const transform = new ConstantsTransform(fills, apolloState, reduxState);
                    
                    const emotionServer = createEmotionServer(emotionCache);
                    const bodyWithStyles = emotionServer.renderStylesToNodeStream();
                    
                    body.pipe(transform).pipe(bodyWithStyles);
                    
                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(bodyWithStyles, {
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
