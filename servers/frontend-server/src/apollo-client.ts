/// <reference path='../../../typings/index.d.ts' />
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import {
    ApolloClient,
    createNetworkInterface,
    ApolloProvider, createBatchingNetworkInterface,
    NetworkInterface,
} from 'react-apollo';
import { app as settings } from '../../../app.json';
import { addPersistedQueries } from 'persistgraphql';
import { addApolloLogging } from 'apollo-logger';
// const queryMap = require('persisted_queries.json');
const queryMap = require('@sample-stack/graphql/extracted_queries.json');

const SERVER_PORT = process.env.GRAPHQL_SERVER_PORT || settings.apiPort;
const CLIENT_PORT = process.env.GRAPHQL_CLIENT_PORT || settings.webpackDevPort;
const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:8080/graphql'; // __EXTERNAL_BACKEND_URL__;


let networkInterface: NetworkInterface;
if (__CLIENT__) {
    networkInterface = new SubscriptionClient(
        (GRAPHQL_URL || (window.location.origin + '/graphql'))
            .replace(/^http/, 'ws')
            .replace(':' + CLIENT_PORT, ':' + SERVER_PORT), {
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
            if (window[__APOLLO_STATE__]) {
                params.initialState = window[__APOLLO_STATE__];
            }
            params.ssrForceFetchDelay = 100;
        } else {
            params.ssrMode = true;
        }
    }
    return new ApolloClient(params);
};

export { createApolloClient };
