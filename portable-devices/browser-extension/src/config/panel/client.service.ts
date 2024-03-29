/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientTypes } from '@common-stack/client-core';
import { Container } from 'inversify';
import { ApolloClient } from '@apollo/client';
import modules, { container } from '../../modules/popup';
import { createApolloClient } from '../base-apollo-client';
import { PUBLIC_SETTINGS } from '../public-config';
 

let __CLIENT_SERVICE__: {
    apolloClient: ApolloClient<any>;
    container: Container;
    services: any;
};
export const createClientContainer = () => {
    if (__CLIENT_SERVICE__) {
        return __CLIENT_SERVICE__;
    }
    const clientState = modules.getStateParams({ resolverContex: () => modules.createService({}, {}) });
    const { cache, apolloClient } = createApolloClient({
        httpGraphqlURL: PUBLIC_SETTINGS.GRAPHQL_URL,
        httpLocalGraphqlURL: PUBLIC_SETTINGS.LOCAL_GRAPHQL_URL || '',
        isDev: process.env.NODE_ENV === 'development',
        isDebug: process.env.NODE_ENV !== 'production',
        isSSR: true,
        scope: 'browser',
        clientState,
        linkConnectionParams: modules.connectionParams,
        additionalLinks: modules.link,
        getDataIdFromObject: (result) => modules.getDataIdFromObject(result),
        possibleTypes: clientState.possibleTypes,
        initialState: null,
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
    };
    return __CLIENT_SERVICE__;
};
