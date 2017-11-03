/// <reference path='../../../../typings/index.d.ts' />
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import {
    ApolloClient,
    createNetworkInterface,
    ApolloProvider, createBatchingNetworkInterface,
    NetworkInterface,
} from 'react-apollo';
import * as url from 'url';
import { PUBLIC_SETTINGS } from '../config/public-config';
import { addPersistedQueries } from 'persistgraphql';
import { addApolloLogging } from 'apollo-logger';
var reqlib: any = require('app-root-path');


const { protocol, port: GRAPHQL_PORT, pathname, hostname } = url.parse(PUBLIC_SETTINGS.GRAPHQL_URL);

let networkInterface: NetworkInterface;
if (__CLIENT__) {
    networkInterface = new SubscriptionClient(
        (PUBLIC_SETTINGS.GRAPHQL_URL)
            .replace(/^http/, 'ws')
        , {
            reconnect: true,
        }) as NetworkInterface;
} else {
    networkInterface = createBatchingNetworkInterface({
        opts: {
            credentials: 'same-origin',
        },
        batchInterval: 20,
        uri: PUBLIC_SETTINGS.GRAPHQL_URL || '/graphql',
    });
}

if (__PERSIST_GQL__) {
    const queryMap = reqlib.require('@sample-stack/graphql-gql/extracted_queries.json');
    if(queryMap) {
        console.log(queryMap)
        networkInterface = addPersistedQueries(networkInterface, queryMap);        
    } else {
        console.warn('extracted_queries not found');
    }
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
