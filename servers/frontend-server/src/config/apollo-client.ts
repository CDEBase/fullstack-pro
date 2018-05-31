/// <reference path='../../../../typings/index.d.ts' />
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createApolloFetch } from 'apollo-fetch';
import { getOperationAST } from 'graphql';
import * as url from 'url';
import { PUBLIC_SETTINGS } from '../config/public-config';
import { addPersistedQueries } from 'persistgraphql';
// import { addApolloLogging } from 'apollo-logger';
import modules from '../modules';



const cache = new InMemoryCache();

let link;
if (__CLIENT__) {

    let connectionParams = {};
    for (const connectionParam of modules.connectionParams) {
        Object.assign(connectionParams, connectionParam());
    }

    const wsClient = new SubscriptionClient(
        (PUBLIC_SETTINGS.GRAPHQL_URL).replace(/^http/, 'ws'), {
            reconnect: true,
            connectionParams,
        },
    );

    wsClient.use([
        {
            applyMiddleware(operationOptions, next) {
                let params = {};
                for (const param of modules.connectionParams) {
                    Object.assign(params, param());
                }

                Object.assign(operationOptions, params);
                next();
            },
        },
    ]);

    wsClient.onDisconnected(() => { });
    wsClient.onReconnected(() => { });

    link = ApolloLink.split(
        operation => {
            const operationAST = getOperationAST(operation.query as any, operation.operationName);
            return !!operationAST && operationAST.operation === 'subscription';
        },
        new WebSocketLink(wsClient) as any,
        new HttpLink({
            uri: PUBLIC_SETTINGS.GRAPHQL_URL,
            // fetch:
            //     modules.createFetch && modules.createFetch(PUBLIC_SETTINGS.GRAPHQL_URL) ||
            //     createApolloFetch({
            //         uri: PUBLIC_SETTINGS.GRAPHQL_URL,
            //         // constructOptions: (reqs, options) => ({
            //         //     ...constructDefaultOptions(reqs, options),
            //         //     credentials: 'include',
            //         // }),
            //     }),
        }),
    );
} else {
    link = new BatchHttpLink({ uri: PUBLIC_SETTINGS.LOCAL_GRAPHQL_URL });
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
const linkState = withClientState({ ...modules.resolvers, cache } as any);

const links = [...modules.link, linkState, link];

const createApolloClient = () => {
    const params: any = {
        dataIdFromObject: (result) => {
            if (result.id && result.__typename) {
                return result.__typename + result.id;
            }
            return null;
        },
        link: ApolloLink.from(links),
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
    const client = new ApolloClient<any>(params);

    if (__CLIENT__ && (process.env.NODE_ENV === 'development' || __DEBUGGING__)) {
        window.__APOLLO_CLIENT__ = client;
    }
    return client;
};

export { createApolloClient };
