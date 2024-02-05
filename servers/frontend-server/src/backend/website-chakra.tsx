import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ApolloProvider } from '@apollo/client/react/react.cjs';
import { getDataFromTree } from '@apollo/client/react/ssr/ssr.cjs';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { persistStore } from 'redux-persist';
import { SlotFillProvider, replaceServerFills } from '@common-stack/components-pro';
import path from 'path';
import fs from 'fs';
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { logger } from '@cdm-logger/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { Html } from './ssr/html';
import createEmotionCache from '../common/createEmotionCache';
import publicEnv from '../config/public-config';
import clientModules, { MainRoute } from '../modules';
import { cacheMiddleware } from './middlewares/cache';
import GA4Provider from '../components/GaProvider';
import { renderServerSideNoSSR } from './renderServerSideNoSSR';

let assetMap;
const cache = createEmotionCache();
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

async function renderServerSide(req, res) {
    try {
        const { apolloClient: client, container, store } = req;

        let context: { pageNotFound?: boolean; url?: string } = { pageNotFound: false };
        let persistor = persistStore(store); // this is needed for ssr

        const extractor = new ChunkExtractor({
            statsFile: path.resolve(__FRONTEND_BUILD_DIR__, 'loadable-stats.json'),
            entrypoints: ['index'],
            publicPath: !__DEV__ && __CDN_URL__ ? __CDN_URL__ : '/',
        });

        const helmetContext = {} as FilledContext;
        let slotFillContext = { fills: {} };
        const Root = (
            <ChunkExtractorManager extractor={extractor}>
                <HelmetProvider context={helmetContext}>
                    <CacheProvider value={cache}>
                        <SlotFillProvider context={slotFillContext}>
                            <ReduxProvider store={store}>
                                <InversifyProvider container={container} modules={clientModules}>
                                     {clientModules.getWrappedRoot(
                                        <ApolloProvider client={client}>
                                            <PluginArea />
                                            <StaticRouter location={req.url} context={context}>
                                                <GA4Provider>
                                                    <MainRoute />
                                                </GA4Provider>
                                            </StaticRouter>
                                            ,
                                        </ApolloProvider>,
                                    )}
                                </InversifyProvider>
                            </ReduxProvider>
                        </SlotFillProvider>
                    </CacheProvider>
                </HelmetProvider>
            </ChunkExtractorManager>
        );

        let content = '';
        try {
            content = await getDataFromTree(Root);
        } catch (e: any) {
            console.log('Apollo Error! Rendering result anyways');
            // if (e instanceof ApolloError) {
            //     const notFound = e.graphQLErrors.some((ge) => (ge.extensions as any)?.code === 'NOT_FOUND');
            //     if (notFound)
            //         store.dispatch(
            //             setError({
            //                 errorType: ErrorEnum.NOT_FOUND,
            //             }),
            //         );
            // }
            console.log(e);
        }
        if (!content) {
            content = ReactDOMServer.renderToString(Root);
        }
        console.log('---CONTENT', content.length);
        if (context.pageNotFound === true) {
            res.status(404);
        }

        if (context.url) {
            res.writeHead(301, { Location: context.url });
            res.end();
        } else {
            if (context.pageNotFound === true) {
                res.status(404);
                res.end();
            }

            if (__DEV__ || !assetMap) {
                assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')).toString());
            }
            // data
            const apolloState = Object.assign({}, client.extract());
            const reduxState = Object.assign({}, store.getState());
            const env = {
                ...publicEnv,
            };
            // styles
            const emotionStyles = extractCriticalToChunks(content);
            const styleSheet = constructStyleTagsFromChunks(emotionStyles);
            // fills
            const fills = Object.keys(slotFillContext.fills);
            content = replaceServerFills(content, fills);
            // html page
            const page = (
                <Html
                    content={content}
                    state={apolloState}
                    assetMap={assetMap}
                    helmet={helmetContext.helmet}
                    extractor={extractor}
                    env={env}
                    fills={fills}
                    reduxState={reduxState}
                    scriptsInserts={clientModules.scriptsInserts}
                    stylesInserts={clientModules.stylesInserts}
                />
            );

            let pageContent = ReactDOMServer.renderToStaticMarkup(page);
            pageContent = pageContent.replace(/__STYLESHEET__/, styleSheet);
            res.status(200);
            res.send(`<!doctype html>\n${pageContent}`);
            res.end();
        }
    } catch (err) {
        logger.error(err, 'SERVER SIDE RENDER failed due to (%j) ', err.message);
        logger.debug(err);
    }
}
export const websiteMiddleware = async (req, res, next) => {
    try {
        if (req.path.indexOf('.') < 0 && __SSR__) {
            return cacheMiddleware(req, res, async () => {
                return await renderServerSide(req, res);
            });
        } else if (req.path.indexOf('.') < 0 && !__SSR__ && req.method === 'GET' && !__DEV__) {
            return await renderServerSideNoSSR(req, res);
        } else {
            next();
        }
    } catch (e) {
        logger.error('RENDERING ERROR:', e);
        return next(e);
    }
};
