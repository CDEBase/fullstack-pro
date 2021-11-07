/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { ClientTypes } from '@common-stack/client-core';
import { Container } from 'inversify';
import { ApolloClient } from '@apollo/client';
import { CdmLogger } from '@cdm-logger/core';
import modules, { container, logger } from '../modules';
import { createApolloClient } from './base-apollo-client';
import { PUBLIC_SETTINGS } from './public-config';

let __CLIENT_SERVICE__: {
    apolloClient: ApolloClient<any>;
    container: Container;
    services: any;
    logger: CdmLogger.ILogger;
};
export const createClientContainer = () => {
    if (__CLIENT_SERVICE__) {
        return __CLIENT_SERVICE__;
    }
    const clientState = modules.getStateParams({ resolverContex: () => modules.createService({}, {}) });
    const { cache, apolloClient } = createApolloClient({
        httpGraphqlURL: PUBLIC_SETTINGS.GRAPHQL_URL,
        httpLocalGraphqlURL: PUBLIC_SETTINGS.LOCAL_GRAPHQL_URL,
        isDev: process.env.NODE_ENV === 'development',
        isDebug: __DEBUGGING__,
        isSSR: __SSR__,
        scope: __CLIENT__ ? 'browser' : 'server',
        clientState,
        getDataIdFromObject: (result) => modules.getDataIdFromObject(result),
        initialState: null,
        logger,
    });
    // attaching the context to client as a workaround.
    container.bind(ClientTypes.ApolloClient).toConstantValue(apolloClient);
    container.bind(ClientTypes.InMemoryCache).toConstantValue(cache);
    const services = modules.createService({}, {});
    (apolloClient as any).container = services;

    __CLIENT_SERVICE__ = {
        container,
        apolloClient,
        services,
        logger,
    };
    if ((module as any).hot) {
        (module as any).hot.dispose(() => {
            // Force Apollo to fetch the latest data from the server
            delete window.__APOLLO_STATE__;
        });
    }
    return __CLIENT_SERVICE__;
};
