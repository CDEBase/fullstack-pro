/// <reference path='../../../../typings/index.d.ts' />
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import {
    ApolloClient,
    createNetworkInterface,
    ApolloProvider, createBatchingNetworkInterface,
    NetworkInterface,
} from 'react-apollo';
import * as url from 'url';
import { options as settings } from '../../../../.spinrc.json';

import { addPersistedQueries } from 'persistgraphql';
import { addApolloLogging } from 'apollo-logger';
// const queryMap = require('persisted_queries.json');
const queryMap = require('@sample-stack/graphql/extracted_queries.json');

const CLIENT_PORT = process.env.GRAPHQL_CLIENT_PORT || settings.webpackDevPort;
const GRAPHQL_URL = process.env.GRAPHQL_URL || __BACKEND_URL__;

const { protocol, port: GRAPHQL_PORT, pathname, hostname } = url.parse(GRAPHQL_URL);

let networkInterface: NetworkInterface;
if (__CLIENT__) {
    networkInterface = new SubscriptionClient(
        (GRAPHQL_URL)
            .replace(/^https?/, 'ws')
        , {
            reconnect: true,
        }) as NetworkInterface;
} else {
    networkInterface = createBatchingNetworkInterface({
        opts: {
            credentials: 'same-origin',
        },
        batchInterval: 20,
        uri: GRAPHQL_URL || '/graphql',
    });
}

if (__PERSIST_GQL__) {
    networkInterface = addPersistedQueries(networkInterface, queryMap);
}
// Hybrid WebSocket Transport
// https://github.com/apollographql/subscriptions-transport-ws#hybrid-websocket-transport
// let networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   networkInterface,
//   wsClient,
// );



// if (settings.apolloLogging) {
//     networkInterface = addApolloLogging(networkInterface);
// }

const createApolloClient = () => {
    const params: any = {
        dataIdFromObject: (result) => {
            if (result.id && result.__typename) {
                return result.__typename + result.id;
            }
            return null;
        },
        networkInterface,

    };
    if (__SSR__) {
        if (__CLIENT__) {
            if (window.__APOLLO_STATE__) {
                params.initialState = window.__APOLLO_STATE__;
            }
            params.ssrForceFetchDelay = 100;
        } else {
            params.ssrMode = true;
        }
    }
    return new ApolloClient(params);
};

export { createApolloClient };
