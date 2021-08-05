/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApolloClient, ApolloClientOptions, ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink, createHttpLink } from '@apollo/client/link/http';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getOperationAST } from 'graphql';
import apolloLogger from 'apollo-link-logger';
import { invariant } from 'ts-invariant';
import fetch from 'node-fetch';

const schema = `

`;

interface IApolloClientParams {
    possibleTypes: any;
    initialState?: any;
    scope: 'browser' | 'server' | 'native';
    linkConnectionParams?: any;
    additionalLinks: any[];
    getDataIdFromObject: (x?: any) => string;
    clientState: any;
    isDebug: boolean;
    isDev: boolean;
    isSSR: boolean;
    httpGraphqlURL: string;
    httpLocalGraphqlURL: string;
}

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

let _apolloClient: ApolloClient<any>;
let _memoryCache: InMemoryCache;
export const createApolloClient = ({
    linkConnectionParams,
    scope,
    isDev,
    isDebug,
    isSSR,
    getDataIdFromObject,
    clientState,
    additionalLinks,
    httpGraphqlURL,
    httpLocalGraphqlURL,
    initialState,
}: IApolloClientParams) => {
    const isBrowser = scope === 'browser';
    const isServer = scope === 'server';
    let link;

    const cache = new InMemoryCache({
        dataIdFromObject: getDataIdFromObject,
        possibleTypes: clientState.possibleTypes,
    });

    if (_apolloClient && _memoryCache) {
        // return quickly if client is already created.
        return {
            apolloClient: _apolloClient,
            cache: _memoryCache,
        };
    }
    _memoryCache = cache;
    if (isBrowser) {
        const connectionParams = () => {
            const param = {};
            for (const connectionParam of linkConnectionParams) {
                Object.assign(param, connectionParam());
            }
            return param;
        };

        const wsLink = new WebSocketLink({
            uri: httpGraphqlURL.replace(/^http/, 'ws'),
            options: {
                reconnect: true,
                timeout: 20000,
                reconnectionAttempts: 10,
                lazy: true,
                connectionParams,
            },
        });
        link = ApolloLink.split(
            ({ query, operationName }) => {
                if (operationName.endsWith('_WS')) {
                    return true;
                }
                const operationAST = getOperationAST(query as any, operationName);
                return !!operationAST && operationAST.operation === 'subscription';
            },
            wsLink,
            new HttpLink({
                uri: httpGraphqlURL,
            }),
        );
    } else {
        // link = new BatchHttpLink({ uri: httpLocalGraphqlURL });
        link = createHttpLink({ uri: httpLocalGraphqlURL, fetch: fetch as any });
    }

    const links = [errorLink, ...additionalLinks, /** ...modules.errorLink, */ link];

    // Add apollo logger during development only
    if ((isDev || isDebug) && isBrowser) {
        links.unshift(apolloLogger);
    }

    const params: ApolloClientOptions<any> = {
        queryDeduplication: true,
        typeDefs: schema.concat(<string>clientState.typeDefs),
        resolvers: clientState.resolvers as any,
        link: ApolloLink.from(links),
        cache,
    };
    if (isSSR) {
        if (isBrowser) {
            if (initialState) {
                cache.restore(initialState);
            }
            params.ssrForceFetchDelay = 100;
        } else if (isServer) {
            params.ssrMode = true;
        }
    }
    _apolloClient = new ApolloClient<any>(params);
    cache.writeData({
        data: {
            ...clientState.defaults,
        },
    });
    if ((isDev || isDebug) && isBrowser) {
        window.__APOLLO_CLIENT__ = _apolloClient;
    }
    return { apolloClient: _apolloClient, cache };
};
