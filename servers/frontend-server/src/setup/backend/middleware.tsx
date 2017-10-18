import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { createBatchingNetworkInterface } from 'apollo-client';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { addApolloLogging } from 'apollo-logger';
import { addPersistedQueries } from 'persistgraphql';
import { Html } from '../ssr/html';
import { Component } from '../../components';
import Helmet from 'react-helmet';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '@sample-stack/client-core';
import { createApolloClient } from '../apollo-client';
import { createReduxStore } from '../../redux-config';
import { options as settings } from '../../../.spinrc.json';
const QUERY_MAP = require('@sample-stack/graphql/extracted_queries.json');

let assetMap;
async function renderServerSide(req, res, queryMap) {

    const client = createApolloClient();

    let initialState = {};
    const store = createReduxStore(initialState, client);

    const component = (
        <ApolloProvider store={store} client={client}>
            <Component />
        </ApolloProvider>
    );

    // await getDataFromTree(component);
    res.status(200);
    const html = ReactDOMServer.renderToString(component);
    const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances

    if (__DEV__ || !assetMap) {
        assetMap = JSON.parse(fs.readFileSync(path.join(settings.frontendBuildDir, 'web', 'assets.json')).toString());
    }
    const apolloState = Object.assign({}, client.store.getState());

    const page = (
        <Html
            content={html}
            state={apolloState}
            assetMap={assetMap}
            helmet={helmet}
        />
    );
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
    res.end();
}

export const websiteMiddleware = async (req, res, next) => {
    try {
        if (req.url.indexOf('.') < 0 && __SSR__) {
            return renderServerSide(req, res, QUERY_MAP);
        } else {
            return next();
        }
    } catch (e) {
        logger.error('RENDERING ERROR:', e);
    }
};
