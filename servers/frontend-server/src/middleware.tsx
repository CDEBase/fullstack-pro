import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { createBatchingNetworkInterface } from 'apollo-client';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { addApolloLogging } from 'apollo-logger';
import { addPersistedQueries } from 'persistgraphql';
import { Html } from './html';
import Helmet from 'react-helmet';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '@sample-stack/client-core';
import { createApolloClient } from './apollo-client';
import { createReduxStore } from './redux-config';
import { app as settings } from '../../../app.json';

const GRAPHQL_URL = process.env.GRAPHQL_URL || __EXTERNAL_BACKEND_URL__;

let assetMap;
async function renderServerSide(req, res, queryMap) {

    const client = createApolloClient();

    let initialState = {};
    const store = createReduxStore(initialState, client);

    const component = (
        <ApolloProvider store={store} client={client}>
            <div>
                <div>
                    <h2>Redux Counter Test</h2>
                </div>
            </div>
        </ApolloProvider>
    );

    await getDataFromTree(component);

    res.status(200);
    const html = ReactDOMServer.renderToString(component);
    const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances

    const apolloState = Object.assign({}, client.store.getState());

    const page = <Html content={html} state={apolloState} assetMap={assetMap} css={} helmet={helmet} />;
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
    res.end();
}

async function renderClientSide(req, res) {
    const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances

    if (__DEV__ || !assetMap) {
        assetMap = JSON.parse(fs.readFileSync(path.join(settings.frontendBuildDir, 'web', 'assets.json')) as any);
    }
    const page = <Html state={({})} assetMap={assetMap} helmet={helmet} />;
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(page)}`);
    res.end();
}

