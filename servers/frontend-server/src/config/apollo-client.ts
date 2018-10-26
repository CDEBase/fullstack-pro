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
// import { addApolloLogging } from 'apollo-logger';
import modules from '../modules';



const cache = new InMemoryCache();
const schema = `
type Query {}
type Mutation {}
`;

let link;
if (__CLIENT__) {

    let connectionParams = () => {
        let param = {};
        for (const connectionParam of modules.connectionParams) {
            Object.assign(param, connectionParam());
        }
        return param;
    };

    const wsLink: any = new WebSocketLink({
        uri: (PUBLIC_SETTINGS.GRAPHQL_URL).replace(/^http/, 'ws'),
        options: {
            reconnect: true,
            timeout: 20000,
            reconnectionAttempts: 10,
            lazy: true,
            connectionParams,
            connectionCallback: async (error) => {
                if (error) {
                    logger.trace('[connectionCallback error] %j', error);
                    // error.message has to match what the server returns.
                    if ((error as any).message === 'TokenExpired') {
                        console.log('onTokenError about to call');
                        await onTokenError(error);
                        // Reset the WS connection for it to carry the new JWT.
                        wsLink.subscriptionClient.close(false, false);
                    }
                }
            },
            onError: async (error) => {
                logger.trace('[Subscription onError] %j', error);
                // error.message has to match what the server returns.
                if (error.message === 'TokenExpired') {
                    await onTokenError(error);
                    // Reset the WS connection for it to carry the new JWT.
                    this.subscriptionClient.close(false, false);
                }
            },
        },
    });


    link = ApolloLink.split(
        ({ query, operationName }) => {
            if (operationName.endsWith('_WS')) {
                return true;
            } else {
                const operationAST = getOperationAST(query as any, operationName);
                return !!operationAST && operationAST.operation === 'subscription';
            }
        },
        wsLink,
        new HttpLink({
            uri: PUBLIC_SETTINGS.GRAPHQL_URL,
        }),
    );
} else {
    link = new BatchHttpLink({ uri: PUBLIC_SETTINGS.LOCAL_GRAPHQL_URL });
}


const linkState = withClientState({
    cache,
    resolvers: _.merge(modules.resolvers),
    typeDefs: schema.concat(modules.schema.join(`\n`)),
} as any);

const links = [...modules.link, linkState, /** ...modules.errorLink, */ link];

// Add apollo logger during development only
if ((process.env.NODE_ENV === 'development' || __DEBUGGING__) && __CLIENT__) {
    links.unshift(apolloLogger);
}

const createApolloClient = () => {
    const params: any = {
        queryDeduplication: true,
        dataIdFromObject: (result) => modules.getDataIdFromObject(result),
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
