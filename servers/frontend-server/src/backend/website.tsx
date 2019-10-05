import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { Html } from './ssr/html';
import Helmet from 'react-helmet';
import path from 'path';
import fs from 'fs';
import { renderToMarkup, renderToSheetList } from 'fela-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { logger } from '@cdm-logger/server';
import { createApolloClient } from '../config/apollo-client';
import * as ReactFela from 'react-fela';
import createRenderer from '../config/fela-renderer';
import { createReduxStore } from '../config/redux-config';
import publicEnv from '../config/public-config';
import clientModules from '../modules';

let assetMap;
async function renderServerSide(req, res) {
    try {

        const client = createApolloClient();

        let context: { pageNotFound?: boolean, url?: string } = { pageNotFound: false };
        const store = createReduxStore();
        const renderer = createRenderer();
        const App = () =>
            clientModules.getWrappedRoot(
                // tslint:disable-next-line:jsx-wrap-multiline
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

        await getDataFromTree(App as any);
        if (context.pageNotFound === true) {
            res.status(404);
        } else {
            res.status(200);
        }

        const html = ReactDOMServer.renderToString(App as any);

        // this comes after Html render otherwise we don't see fela rules generated
        const appStyles = renderToSheetList(renderer);

        // We need to tell Helmet to compute the right meta tags, title, and such.
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
                    styleSheet={appStyles}
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
