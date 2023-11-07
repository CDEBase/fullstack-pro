import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ApolloProvider } from '@apollo/client/react/react.cjs';
import { getDataFromTree } from '@apollo/client/react/ssr/ssr.cjs';
import { Html } from './ssr/html';
import path from 'path';
import fs from 'fs';
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { logger } from '@cdm-logger/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { createMemoryHistory } from 'history';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../common/createEmotionCache';
import createEmotionServer from '@emotion/server/create-instance';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { createClientContainer } from '../config/client.service';
import { createReduxStore } from '../config/redux-config';
import publicEnv from '../config/public-config';
import clientModules, { MainRoute } from '../modules';

let assetMap;
const cache = createEmotionCache();
const { extractCriticalToChunks, extractCritical } = createEmotionServer(cache);

async function renderServerSide(req, res, data) {
    try {
        const { apolloClient: client } = createClientContainer();

        let context: { pageNotFound?: boolean; url?: string } = { pageNotFound: false };
        const history = createMemoryHistory({ initialEntries: [req.url] });
        const { store } = createReduxStore(history);

        // const extractor = new ChunkExtractor({
        //     statsFile: path.resolve(__FRONTEND_BUILD_DIR__, 'loadable-stats.json'),
        //     entrypoints: ['index'],
        //     publicPath: !__DEV__ && __CDN_URL__ ? __CDN_URL__ : '/',
        // });
        
        const helmetContext = {} as FilledContext;
        const Root = (
            <HelmetProvider context={helmetContext}>
                <ReduxProvider store={store}>
                    <ApolloProvider client={client}>
                        <CacheProvider value={cache}>
                            {clientModules.getWrappedRoot(
                                <StaticRouter location={req.url} context={context}>
                                    <MainRoute />
                                </StaticRouter>,
                            )}
                        </CacheProvider>
                    </ApolloProvider>
                </ReduxProvider>
            </HelmetProvider>
        );
        
        try {
            await getDataFromTree(Root);
        } catch (e: any) {
            console.log('Apollo Error! Rendering result anyways');
            console.log(e);
        }
        const content = ReactDOMServer.renderToString(Root);
        console.log('---CONTENT', content.length);
        if (context.pageNotFound === true) {
            res.status(404);
        }

        const emotionStyles = extractCriticalToChunks(content);
        let emotionIds: string[] = [];
        const emotionStyleTags = emotionStyles.styles.map((style) => {
            emotionIds.push(...style.ids) 
            return (
                <style
                  data-emotion={`${style.key} ${style.ids.join(" ")}`}
                  key={style.key}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: style.css }}
                />
              )
        });
        
        if (context.url) {
            res.writeHead(301, { Location: context.url });
            res.end();
        } else {
            if (__DEV__ || !assetMap) {
                assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')).toString());
            }
            const apolloState = {...client.extract()};
            const reduxState = {...store.getState()};
            const env = {...publicEnv};

            data = data.replace(/{\/\*__ENV__\*\/}/, JSON.stringify(env));
            data = data.replace(/{\/\*__APOLLO_STATE__\*\/}/, JSON.stringify(apolloState));
            data = data.replace(/{\/\*__PRELOADED_STATE__\*\/}/, JSON.stringify(reduxState));
            data = data.replace(/{\/\*__EMOTION_IDS__\*\/}/, JSON.stringify(emotionIds));
            data = data.replace(/<!--%__CONTENT__%-->/, content);
            console.log('---HTML CONTENT', data.length);
            
            res.status(200);
            res.send(data);
            res.end();
        }
    } catch (err) {
        logger.error('SERVER SIDE RENDER failed due to (%j) ', err.message);
        logger.debug(err);
    }
}
export const websiteMiddleware = async (req, res, next) => {
    try {
        if (/[^\\/]+\.[^\\/]+$/.test(req.path)) {
            const filePath = path.resolve(__FRONTEND_BUILD_DIR__, req.path);
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(err.status).end();
                }
            });
        } else {
            const filePath = path.resolve(__FRONTEND_BUILD_DIR__, 'index.html');
            fs.readFile(filePath, 'utf8', async (err, data: string) => {
                if (err) {
                    res.send(err).end();
                } else {
                    await renderServerSide(req, res, data);
                }
            });
        }
    } catch (e) {
        logger.error('RENDERING ERROR:', e);
        return next(e);
    }
};
