/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { ApolloClient, ApolloClientOptions, ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink } from '@apollo/client/link/http';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getOperationAST } from 'graphql';
import apolloLogger from 'apollo-link-logger';
import { logger } from '@cdm-logger/client';
import { invariant } from 'ts-invariant';
import { PUBLIC_SETTINGS } from './public-config';
import modules from '../modules';

const clientState = modules.getStateParams({ resolverContex: () => modules.createService({}, {}) });

// TODO: add cache redirects to module
export const cache = new InMemoryCache({
    dataIdFromObject: (result) => modules.getDataIdFromObject(result),
    possibleTypes: clientState.possibleTypes,
});

const schema = ``;

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
            // tslint:disable-next-line
            invariant.warn(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
        );
    }
    if (networkError) {
        // tslint:disable-next-line
        invariant.warn(`[Network error]: ${networkError}`);
    }
});
let link;
if (__CLIENT__) {
    const connectionParams = () => {
        const param = {};
        for (const connectionParam of modules.connectionParams) {
            Object.assign(param, connectionParam());
        }
        return param;
    };

    const wsLink = new WebSocketLink({
        uri: PUBLIC_SETTINGS.GRAPHQL_URL.replace(/^http/, 'ws'),
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
            if (operationName && operationName.endsWith('_WS')) {
                return true;
            }
            const operationAST = getOperationAST(query as any, operationName);
            return !!operationAST && operationAST.operation === 'subscription';
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
        cache,
        queryDeduplication: true,
        typeDefs: schema.concat(<string>clientState.typeDefs),
        resolvers: clientState.resolvers as any,
        link: ApolloLink.from(links),
        connectToDevTools: __CLIENT__ && (process.env.NODE_ENV === 'development' || __DEBUGGING__),
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

    clientState?.defaults?.forEach((x) => {
        if (x.type === 'query') {
            cache.writeQuery(x);
        } else if (x.type === 'fragment') {
            cache.writeFragment(x);
        }
    });

    return _apolloClient;
};

export { createApolloClient };
