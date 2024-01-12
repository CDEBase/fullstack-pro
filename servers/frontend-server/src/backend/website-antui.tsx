import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ApolloProvider } from '@apollo/client/react/react.cjs';
import { getDataFromTree } from '@apollo/client/react/ssr/ssr.cjs';
import path from 'path';
import fs from 'fs';
import url from 'url';
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { logger } from '@cdm-logger/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { createMemoryHistory } from 'history';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { loadLifecycle, ORG_NAME_CHANGE } from '@adminide-stack/platform-client';
import { LOCATION_CHANGE } from 'connected-react-router';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { createCache as createAntdCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { loadExtensionController } from '@adminide-stack/extension-module-browser';
import { persistStore } from 'redux-persist';
import { Html } from './ssr/html';
import { createReduxStore } from '../config/redux-config';
import publicEnv from '../config/public-config';
import clientModules, { MainRoute } from '../modules';

let assetMap;
const antdCache = createAntdCache();

async function renderServerSide(req, res) {
    try {
        const { apolloClient: client, container, serviceFunc } = req;
        // container.bind(IClientContainerService.ExtensionController).toConstantValue({});
        let context: { pageNotFound?: boolean; url?: string } = { pageNotFound: false };
        const history = createMemoryHistory({ initialEntries: [req.url] });
        const { store } = createReduxStore(history, client, serviceFunc, container);

        const extractor = new ChunkExtractor({
            statsFile: path.resolve(__FRONTEND_BUILD_DIR__, 'loadable-stats.json'),
            entrypoints: ['index'],
            publicPath: !__DEV__ && __CDN_URL__ ? __CDN_URL__ : '/',
        });
        const helmetContext = {} as FilledContext;
        const Root = (
            <ChunkExtractorManager extractor={extractor}>
                <HelmetProvider context={helmetContext}>
                    <StyleProvider cache={antdCache}>
                        <ReduxProvider store={store}>
                            <InversifyProvider container={container} modules={clientModules}>
                                {clientModules.getWrappedRoot(
                                    <ApolloProvider client={client}>
                                        <PluginArea />
                                        <StaticRouter location={req.url} context={context}>
                                            <MainRoute />
                                        </StaticRouter>
                                    </ApolloProvider>,
                                    req,
                                )}
                            </InversifyProvider>
                        </ReduxProvider>
                    </StyleProvider>
                </HelmetProvider>
            </ChunkExtractorManager>
        );
        let content = '';

        try {
            const orgName = await loadLifecycle(req.url, clientModules.getConfiguredRoutes(), client, logger, {  loadRoot: true});
            // console.log('orgName', orgName);
            if (orgName) {
                store.dispatch({
                    type: ORG_NAME_CHANGE,
                    payload: { orgName },
                });
            }
            // store.dispatch({
            //     type: LOCATION_CHANGE,
            //     payload: {
            //         location: url.parse(req.url),
            //         action: 'POP',
            //         isFirstRendering: true,
            //     }
            // });
            loadExtensionController(container, serviceFunc(), client, null);
            content = await getDataFromTree(Root);
        } catch (e: any) {
            console.log('Apollo Error! Rendering result anyways');
            console.log(e);
        }

        if (!content) {
            content = ReactDOMServer.renderToString(Root);
        }
        console.log('Content---', content.length);

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
            const reduxState = Object.assign({}, store.getState());
            const env = {
                ...publicEnv,
            };
            // styles
            let styleSheet = extractStyle(antdCache);
            // html page
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
        logger.error(err,'SERVER SIDE RENDER failed due to (%j) ', err.message);
        logger.info(err);
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
