/// <reference path='../../../../typings/index.d.ts' />
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createApolloFetch } from 'apollo-fetch';
import { getOperationAST } from 'graphql';
import * as url from 'url';
import { PUBLIC_SETTINGS } from '../config/public-config';
import { addPersistedQueries } from 'persistgraphql';
import { addApolloLogging } from 'apollo-logger';
import { modules } from '../modules';


const fetch = createApolloFetch({
    uri: PUBLIC_SETTINGS.GRAPHQL_URL,
    constructOptions: modules.constructFetchOptions,
});
for (const middleware of modules.middlewares) {
    fetch.batchUse(({ requests, options }, next) => {
        options.credentials = 'same-origin';
        options.headers = options.headers || {};
        const reqs = [...requests];
        const innerNext = (): void => {
            if (reqs.length > 0) {
                const req = reqs.shift();
                if (req) {
                    middleware(req, options, innerNext);
                }
            } else {
                next();
            }
        };
        innerNext();
    });
}



let connectionParams = {};
for (const connectionParam of modules.connectionParams) {
    Object.assign(connectionParams, connectionParam());
}



for (const afterware of modules.afterwares) {
    fetch.batchUseAfter(({ response, options }, next) => {
        afterware(response, options, next);
    });
}


const cache = new InMemoryCache();

let link;
if (__CLIENT__) {
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
            const operationAST = getOperationAST(operation.query, operation.operationName);
            return !!operationAST && operationAST.operation === 'subscription';
        },
        new WebSocketLink(wsClient) as any,
        new BatchHttpLink({
            uri: PUBLIC_SETTINGS.GRAPHQL_URL,
            // fetchOptions: {
            //     mode: 'no-cors',
            // },
            // fetch,
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
const linkState = withClientState({ ...modules.getStateParams, cache });

const createApolloClient = () => {
    const params: any = {
        dataIdFromObject: (result) => {
            if (result.id && result.__typename) {
                return result.__typename + result.id;
            }
            return null;
        },
        link: ApolloLink.from([linkState, link]),
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
