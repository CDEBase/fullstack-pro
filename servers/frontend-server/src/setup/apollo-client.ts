/// <reference path='../../../../typings/index.d.ts' />
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createApolloFetch } from 'apollo-fetch';
import { getOperationAST } from 'graphql';
import * as url from 'url';
import { PUBLIC_SETTINGS } from '../config/public-config';
import { addPersistedQueries } from 'persistgraphql';
import { addApolloLogging } from 'apollo-logger';


const { protocol, port: GRAPHQL_PORT, pathname, hostname } = url.parse(PUBLIC_SETTINGS.GRAPHQL_URL);

const fetch = createApolloFetch({
    uri: PUBLIC_SETTINGS.GRAPHQL_URL,
    // constructOptions: 
});
const cache = new InMemoryCache();

let link;
if (__CLIENT__) {
    const wsClient = new SubscriptionClient(
        (PUBLIC_SETTINGS.GRAPHQL_URL).replace(/^http/, 'ws'), {
            reconnect: true,
            // connectionParams,
        },
    );

    wsClient.use([

    ]);

    wsClient.onDisconnected(() => {});
    wsClient.onReconnected(() => {});

    link = ApolloLink.split(
        operation => {
            const operationAST = getOperationAST(operation.query, operation.operationName);
            return !!operationAST && operationAST.operation === 'subscription';
        },
        new WebSocketLink(wsClient) as any,
        new BatchHttpLink({ fetch }) as any,
    );
} else {
    link = new BatchHttpLink({ fetch });
}

// TODO Setup PersistQueries
// if (__PERSIST_GQL__) {
//     import('@sample-stack/graphql-gql/extracted_queries.json').then(queryMap => {
//         console.log(queryMap)
//     }).catch(() => {
//         console.warn('extracted_queries not found');
//     });
// }

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
        link,
        cache,
    };
    if (__SSR__) {
        if (__CLIENT__) {
            if (window.__APOLLO_STATE__) {
                cache.restore(window.__APOLLO_STATE__);
            }
            params.ssrForceFetchDelay = 100;
        } else {
            params.ssrMode = true;
        }
    }
    return new ApolloClient<any>(params);
};

export { createApolloClient };
