import 'reflect-metadata';

import { PassThrough } from "node:stream";
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider, replaceServerFills } from '@common-stack/components-pro';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { Provider as ReduxProvider } from 'react-redux';
import { logger } from '@cdm-logger/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import publicEnv from './config/public-config';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import clientModules from './modules/module';
import { containerMiddleware } from './backend/middlewares/container';
import { cacheMiddleware } from './backend/middlewares/cache';
import createEmotionCache from './common/createEmotionCache';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';

const cache = createEmotionCache();
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise(async (resolve, reject) => {
    let content = '';
    try {
      const { container, serviceFunc, logger, apolloClient: client } = createClientContainer(request);
      const services = serviceFunc();
      const { store } = createReduxStore(client, services, container);
      
      try {
        await clientModules.beforeSSR({
          request,
          module: clientModules,
        })
      } catch (e: any) {
        console.log('Before SSR Error!');
        console.log(e);
      }
  
      // const extractor = new ChunkExtractor({
      //   statsFile: path.resolve(__FRONTEND_BUILD_DIR__, 'loadable-stats.json'),
      //   entrypoints: ['index'],
      //   publicPath: !__DEV__ && __CDN_URL__ ? __CDN_URL__ : '/',
      // });
      // const helmetContext = {} as FilledContext;
      let slotFillContext = { fills: {} };
      const Root = (
        // <ChunkExtractorManager extractor={extractor}>
          // <HelmetProvider context={helmetContext}>
            <CacheProvider value={cache}>
              <SlotFillProvider context={slotFillContext}>
                <ReduxProvider store={store}>
                  <InversifyProvider container={container} modules={clientModules}>
                    {clientModules.getWrappedRoot(
                      <ApolloProvider client={client}>
                        <RemixServer
                          context={remixContext}
                          url={request.url}
                          abortDelay={ABORT_DELAY}
                        />
                      </ApolloProvider>,
                      request,
                    )}
                  </InversifyProvider>
                </ReduxProvider>
              </SlotFillProvider>
            </CacheProvider>
          // </HelmetProvider>
        // </ChunkExtractorManager>
      );
      
      try {
        content = await getDataFromTree(Root);
      } catch (e: any) {
        console.log('Apollo Error! Rendering result anyways');
        console.log(e);
      }
      if (!content) {
        content = ReactDOMServer.renderToString(Root);
      }
      logger.info('Content---', content.length);
  
      // fills
      const fills = Object.keys(slotFillContext.fills);
      content = replaceServerFills(content, fills);
  
      const apolloState = {...client.extract()};
      const reduxState = {...store.getState()};
      const env = {...publicEnv};
      const emotionStyles = extractCriticalToChunks(content);
      const styleSheet = constructStyleTagsFromChunks(emotionStyles);

      content = content.replace('[__ENV__]', serialize(env, { isJSON: true }));
      content = content.replace('[__APOLLO_STATE__]', serialize(apolloState, { isJSON: true }));
      content = content.replace('[__PRELOADED_STATE__]', serialize(reduxState, { isJSON: true }));
      content = content.replace('[__SLOT_FILLS__]', serialize(fills, { isJSON: true }));
      content = content.replace('__STYLESHEET__', styleSheet);

      responseHeaders.set("Content-Type", "text/html");

      resolve(
        new Response(content, {
          headers: responseHeaders,
          status: responseStatusCode,
        })
      );
    } catch (err: any) {
      logger.error(err, 'SERVER SIDE RENDER failed due to (%j) ', err.message);
      logger.info(err);
      reject(err);
    }
  });
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
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
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
