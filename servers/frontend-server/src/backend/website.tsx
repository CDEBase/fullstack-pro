import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
// import { addApolloLogging } from 'apollo-logger';
import { addPersistedQueries } from 'persistgraphql';
import { Html } from './ssr/html';
// import { Component } from '../components';
import Helmet from 'react-helmet';
import * as path from 'path';
import * as fs from 'fs';
const { renderToMarkup } = require('fela-dom');
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { logger } from '@cdm-logger/server';
import { createApolloClient } from '../config/apollo-client';
import * as ReactFela from 'react-fela';
import createRenderer from './felaRenderer';
import { SETTINGS } from '../config';
import { createReduxStore } from '../config/redux-config';
import publicEnv from '../config/public-config';
import clientModules from '../modules';

let assetMap;
async function renderServerSide(req, res) {
    try {
        // const  clientModules  = require('../modules');
        const client = createApolloClient();

        let context: { pageNotFound?: boolean, url?: string } = { pageNotFound: false };
        const store = createReduxStore();
        const renderer = createRenderer();
        const App = () =>
            clientModules.getWrappedRoot(
                <ReduxProvider store={store} >
                    <ApolloProvider client={client}>
                        <ReactFela.Provider renderer={renderer} >
                            <StaticRouter location={req.url} context={context}>
                                {clientModules.getRouter()}
                            </StaticRouter>
                        </ReactFela.Provider>
                    </ApolloProvider>
                </ReduxProvider>,
                req,
            );
        const component = App();
        const appCss = renderToMarkup(renderer);
        await getDataFromTree(component as any);
        if (context.pageNotFound === true) {
            res.status(404);
        } else {
            res.status(200);
        }

        const html = ReactDOMServer.renderToString(component as any);


        const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances

        if (context.url) {
            res.writeHead(301, { Location: context.url });
            res.end();
        } else {
            if (__DEV__ || !assetMap) {
                assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'web', 'assets.json')).toString());
            }
            const apolloState = Object.assign({}, client.extract());
            const reduxState = Object.assign({}, store.getState());
            const env = {
                ...publicEnv,
            };
            const page = (
                <Html
                    content={html}
                    state={apolloState}
                    assetMap={assetMap}
                    helmet={helmet}
                    css={appCss}
                    env={env}
                    reduxState={reduxState}
                />
            );
            res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
            res.end();
        }
    } catch (err) {
        logger.error('SERVER SIDE RENDER failed due to (%j) ', err.message);
        logger.debug(err);
    }
}
export const websiteMiddleware = async (req, res, next) => {
    try {
        if (req.url.indexOf('.') < 0 && __SSR__) {
            return renderServerSide(req, res);
        } else {
            return next();
        }
    } catch (e) {
        logger.error('RENDERING ERROR:', e);
        return next(e);
    }
};
