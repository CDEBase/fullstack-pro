import { ApolloClient, ApolloClientOptions } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getOperationAST } from 'graphql';
import apolloLogger from 'apollo-link-logger';

import { PUBLIC_SETTINGS } from '../config/public-config';
import modules from '../modules';
import { logger } from '@cdm-logger/client';
import { merge } from 'lodash-es';
import { invariant } from 'ts-invariant';

// TODO: add cache redirects to module
const cache = new InMemoryCache({ dataIdFromObject: (result) => modules.getDataIdFromObject(result) });
const schema = `
type Query {}
type Mutation {}
`;

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
            // tslint:disable-next-line
            invariant.warn(
                `[GraphQL error]: Message: ${message}, Location: ` +
                `${locations}, Path: ${path}`,
            ),
        );
    }
    if (networkError) {
        // tslint:disable-next-line
        invariant.warn(`[Network error]: ${networkError}`);
    }
});
let link;
if (__CLIENT__) {
    let connectionParams = () => {
        let param = {};
        for (const connectionParam of modules.connectionParams) {
            Object.assign(param, connectionParam());
        }
        return param;
    };

    const wsLink = new WebSocketLink({
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
                        // Reset the WS connection for it to carry the new JWT.
                        (wsLink as any).subscriptionClient.close(false, false);
                    }
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

const links = [errorLink, ...modules.link, /** ...modules.errorLink, */ link];

// Add apollo logger during development only
if ((process.env.NODE_ENV === 'development' || __DEBUGGING__) && __CLIENT__) {
    links.unshift(apolloLogger);
}

let _apolloClient: ApolloClient<any>;
const createApolloClient = () => {
    if (_apolloClient) {
        // return quickly if client is already created.
        return _apolloClient;
    }
    const params: ApolloClientOptions<any> = {
        queryDeduplication: true,
        typeDefs: schema.concat(modules.getStateParams.typeDefs as string),
        resolvers: modules.getStateParams.resolvers,
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
    _apolloClient = new ApolloClient<any>(params);
    cache.writeData({
        data: {
            ...modules.getStateParams.defaults,
        },
    });
    if (__CLIENT__ && (process.env.NODE_ENV === 'development' || __DEBUGGING__)) {
        window.__APOLLO_CLIENT__ = _apolloClient;
    }
    return _apolloClient;
};

export { createApolloClient };
