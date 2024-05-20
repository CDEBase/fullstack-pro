// apolloClient.ts
import { isBoolean } from 'lodash-es';
import { ApolloClient, ApolloClientOptions, ApolloLink, NormalizedCacheObject, InMemoryCache } from '@apollo/client/index.js';
import { HttpLink, createHttpLink } from '@apollo/client/link/http';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getOperationAST } from 'graphql';
import { invariant } from 'ts-invariant';
import { IClientState } from '@common-stack/client-core';
import { RetryLink } from '@apollo/client/link/retry';
import { createClient } from 'graphql-ws';
import fetch from 'cross-fetch';
import { CdmLogger } from '@cdm-logger/core';
import { createCache, initializeCache } from './base-apollo-cache';

const schema = `
  # Add your schema here
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
            invariant.warn(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
        );
    }
    if (networkError) {
        invariant.warn(`[Network error]: ${networkError}`);
    }
});

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
}: IApolloClientParams): { apolloClient: ApolloClient<NormalizedCacheObject>, cache: InMemoryCache } => {
    const isBrowser = scope === 'browser';
    const isServer = scope === 'server';

    const cache = createCache({ getDataIdFromObject, clientState, logger });
    logger.debug('Created new Apollo memory cache');

    const retryLink = new RetryLink({
        attempts: async (count, operation, error) => {
            const promises = (clientState.retryLinkAttemptFuncs || []).map((func) => func(count, operation, error));
            try {
                const result = await Promise.all(promises);
                return !!result.find((item) => item && isBoolean(item));
            } catch (e) {
                logger.trace('Error occurred in retryLink Attempt condition', e);
                throw e;
            }
        },
    });

    let link: ApolloLink;

    if (isBrowser) {
        const connectionParams = async () => {
            const param: { [key: string]: any } = {};
            for (const connectionParam of clientState.connectionParams) {
                const result = await connectionParam as Function;
                merge(param, await result());
            }
            return param;
        };

        let timedOut: NodeJS.Timeout;
        let activeSocket: unknown;

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
                        activeSocket = socket;
                    },
                    error: async (error) => {
                        logger.error(error, '[WS connectionCallback error] %j');
                        const promises = (clientState.connectionCallbackFuncs || []).map((func) => func(wsLink, error, {}));
                        try {
                            await Promise.all(promises);
                        } catch (err) {
                            logger.trace('Error occurred in connectionCallback condition', err);
                            throw err;
                        }
                    },
                    ping: (received) => {
                        logger.trace('Pinged Server');
                        if (!received)
                            // sent
                            timedOut = setTimeout(() => {
                                if (activeSocket?.readyState === WebSocket?.OPEN)
                                    activeSocket?.close(4408, 'Request Timeout');
                            }, 5000); // wait 5 seconds for the pong and then close the connection
                    },
                    pong: (received) => {
                        logger.trace('Pong received');
                        if (received) clearTimeout(timedOut); // pong is received, clear connection close timeout
                    },
                    // inactivityTimeout: 10000,
                },
            }),
        );

        link = ApolloLink.split(
            ({ query, operationName }) => {
                if (operationName.endsWith('_WS')) {
                    return true;
                }
                const operationAST = getOperationAST(query, operationName);
                return !!operationAST && operationAST.operation === 'subscription';
            },
            wsLink,
            new HttpLink({ uri: httpGraphqlURL, credentials: 'include', fetch }),
        );
    } else if (isServer) {
        link = new BatchHttpLink({
            uri: httpLocalGraphqlURL,
            fetch,
            batchInterval: 2000,
            batchMax: 100,
            credentials: 'include',
        });
    } else {
        link = new HttpLink({ uri: httpLocalGraphqlURL, fetch, credentials: 'include' });
    }

    const links = [errorLink, retryLink, ...(clientState.preLinks || []), link];

    const params: ApolloClientOptions<any> = {
        queryDeduplication: true,
        typeDefs: schema.concat(clientState.typeDefs || ''),
        resolvers: clientState.resolvers as any,
        link: ApolloLink.from(links),
        cache,
        credentials: 'include',
        connectToDevTools: isBrowser && (isDev || isDebug),
    };

    if (isSSR) {
        if (isBrowser) {
            params.ssrForceFetchDelay = 100;
        } else if (isServer) {
            params.ssrMode = true;
        }
    }

    const apolloClient = new ApolloClient<any>(params);
    logger.debug('Created new Apollo client');

    initializeCache({ cache, initialState, clientState, logger });

    return { apolloClient, cache };
};
