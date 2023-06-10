// version 09/18/2021
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApolloClient, ApolloClientOptions, ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink, createHttpLink } from '@apollo/client/link/http';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getOperationAST } from 'graphql';
import { invariant } from 'ts-invariant';
import { IClientState } from '@common-stack/client-core';
import fetch from 'node-fetch';
import { isBoolean, merge } from 'lodash';
import { CdmLogger } from '@cdm-logger/core';
import { RetryLink } from '@apollo/client/link/retry';
import { createClient } from 'graphql-ws';

const schema = `

`;

interface IApolloClientParams {
    initialState?: any;
    scope: 'browser' | 'server' | 'native';
    getDataIdFromObject: (x?: any) => string;
    clientState: IClientState;
    isDebug: boolean;
    isDev: boolean;
    isSSR: boolean;
    httpGraphqlURL: string;
    httpLocalGraphqlURL: string;
    logger: CdmLogger.ILogger;
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
    scope,
    isDev,
    isDebug,
    isSSR,
    getDataIdFromObject,
    clientState,
    httpGraphqlURL,
    httpLocalGraphqlURL,
    initialState,
    logger,
}: IApolloClientParams) => {
    const isBrowser = scope === 'browser';
    const isServer = scope === 'server';
    let link;

    const cache = new InMemoryCache({
        dataIdFromObject: getDataIdFromObject,
        possibleTypes: clientState.possibleTypes,
        typePolicies: clientState.typePolicies,
    });

    const attemptConditions = async (count: number, operation: any, error: Error) => {
        const promises = (clientState.retryLinkAttemptFuncs || []).map((func) => func(count, operation, error));

        try {
            const result = await promises;
            return !!result.find((item) => item && isBoolean(item));
        } catch (e) {
            logger.trace('Error occured in retryLink Attempt condition', e);
            throw e;
        }
    };

    const retrylink = new RetryLink({
        attempts: attemptConditions,
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
        const connectionParams = async () => {
            const param: { [key: string]: any } = {};
            for (const connectionParam of clientState.connectionParams) {
                merge(param, await connectionParam);
            }
            return param;
        };

        let timedOut, activeSocket;

        const wsLink = new GraphQLWsLink(
            createClient({
                url: httpGraphqlURL.replace(/^http/, 'ws'),
                retryAttempts: 10,
                lazy: true,
                reconnect: true,
                timeout: 30000,
                shouldRetry: () => true,
                keepAlive: 10000,
                connectionParams,
                on: {
                    connected: (socket) => {
                        activeSocket = socket
                    },
                    error: async (error: Error[]) => {
                        logger.error(error, '[WS connectionCallback error] %j');
                        const promises = (clientState.connectionCallbackFuncs || []).map((func) =>
                            func(wsLink, error, {}),
                        );
                        try {
                            await promises;
                        } catch (err) {
                            logger.trace('Error occurred in connectionCallback condition', err);
                            throw err;
                        }
                    },
                    // connected: (socket, payload) => {}
                    ping: (received) => {
                        logger.trace("Pinged Server")
                        if (!received)
                            // sent
                            timedOut = setTimeout(() => {
                                if (activeSocket?.readyState === WebSocket?.OPEN)
                                    activeSocket?.close(4408, 'Request Timeout');
                            }, 5000); // wait 5 seconds for the pong and then close the connection
                    },
                    pong: (received) => {
                        logger.trace("Pong received")
                        if (received) clearTimeout(timedOut); // pong is received, clear connection close timeout
                    }
                    // inactivityTimeout: 10000,
                },
            }),
        );

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
    } else if (isServer) {
        link = new BatchHttpLink({ uri: httpLocalGraphqlURL, fetch: fetch as any });
    } else {
        link = createHttpLink({ uri: httpLocalGraphqlURL, fetch: fetch as any });
    }

    const links = [errorLink, retrylink, ...(clientState.preLinks || []), link];

    // Add apollo logger during development only
    if (isBrowser && (isDev || isDebug)) {
        const apolloLogger = require('apollo-link-logger');
        links.unshift(apolloLogger.default);
    }

    const params: ApolloClientOptions<any> = {
        queryDeduplication: true,
        typeDefs: schema.concat(<string>clientState.typeDefs),
        resolvers: clientState.resolvers as any,
        link: ApolloLink.from(links),
        cache,
        connectToDevTools: isBrowser && (isDev || isDebug),
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

    clientState?.defaults?.forEach((x) => {
        if (x.type === 'query') {
            cache.writeQuery(x);
        } else if (x.type === 'fragment') {
            cache.writeFragment(x);
        }
    });

    return { apolloClient: _apolloClient, cache };
};
