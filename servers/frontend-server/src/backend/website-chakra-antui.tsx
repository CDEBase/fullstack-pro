import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ApolloProvider } from '@apollo/client/react/react.cjs';
import { getDataFromTree } from '@apollo/client/react/ssr/ssr.cjs';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import path from 'path';
import fs from 'fs';
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import { logger } from '@cdm-logger/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { createMemoryHistory } from 'history';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { createCache as createAntdCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { Html } from './ssr/html';
import createEmotionCache from '../common/createEmotionCache';
import { createClientContainer } from '../config/client.service';
import { createReduxStore } from '../config/redux-config';
import publicEnv from '../config/public-config';
import clientModules, { MainRoute } from '../modules';

let assetMap;
const cache = createEmotionCache();
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

const antdCache = createAntdCache();

async function renderServerSide(req, res) {
    try {
        const { apolloClient: client } = createClientContainer();

        let context: { pageNotFound?: boolean; url?: string } = { pageNotFound: false };
        const history = createMemoryHistory({ initialEntries: [req.url] }); // match initial route to express path
        const { store } = createReduxStore(history);

        const extractor = new ChunkExtractor({
            statsFile: path.resolve(__FRONTEND_BUILD_DIR__, 'loadable-stats.json'),
            entrypoints: ['index'],
            publicPath: !__DEV__ && __CDN_URL__ ? __CDN_URL__ : '/',
        });
        const helmetContext = {} as FilledContext;
        const Root = (
            <ChunkExtractorManager extractor={extractor}>
                <HelmetProvider context={helmetContext}>
                    <CacheProvider value={cache}>
                        <StyleProvider cache={antdCache}>
                            <ReduxProvider store={store}>
                                {clientModules.getWrappedRoot(
                                    <ApolloProvider client={client}>
                                        <StaticRouter location={req.url} context={context}>
                                            <MainRoute />
                                        </StaticRouter>
                                        ,
                                    </ApolloProvider>,
                                )}
                            </ReduxProvider>
                        </StyleProvider>
                    </CacheProvider>
                </HelmetProvider>
            </ChunkExtractorManager>
        );

        try {
            await getDataFromTree(Root);
        } catch (e: any) {
            console.log('Apollo Error! Rendering result anyways');
            console.log(e);
        }
        const content = ReactDOMServer.renderToString(Root);
        if (context.pageNotFound === true) {
            res.status(404);
        }

        if (context.url) {
            res.writeHead(301, { Location: context.url });
            res.end();
        } else {
            if (__DEV__ || !assetMap) {
                assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')).toString());
            }
            // data
            const apolloState = Object.assign({}, client.extract());

            console.log('---APOLLO STATE', apolloState);
            const reduxState = Object.assign({}, store.getState());
            const env = {
                ...publicEnv,
            };
            // styles
            let styleSheet = extractStyle(antdCache);
            const emotionStyles = extractCriticalToChunks(content);
            const styles = constructStyleTagsFromChunks(emotionStyles);
            styleSheet = styleSheet + styles;
            // Html Page
            const page = (
                <Html
                    content={content}
                    state={apolloState}
                    assetMap={assetMap}
                    helmet={helmetContext.helmet}
                    extractor={extractor}
                    env={env}
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
        logger.error('SERVER SIDE RENDER failed due to (%j) ', err.message);
        logger.debug(err);
    }
}
export const websiteMiddleware = async (req, res, next) => {
    try {
        if (req.path.indexOf('.') < 0 && __SSR__) {
            return await renderServerSide(req, res);
        } else if (req.path.indexOf('.') < 0 && !__SSR__ && req.method === 'GET' && !__DEV__) {
            logger.debug('FRONEND_BUILD_DIR with index.html');
            res.sendFile(path.resolve(__FRONTEND_BUILD_DIR__, 'index.html'));
        } else {
            next();
        }
    } catch (e) {
        logger.error('RENDERING ERROR:', e);
        return next(e);
    }
};
