/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { ClientTypes } from '@common-stack/client-core';
import { Container } from 'inversify';
import { ApolloClient } from '@apollo/client';
import { CdmLogger } from '@cdm-logger/core';
import modules, { container, logger } from '../modules';
import { createApolloClient, cache } from './apollo-client';

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
    const apolloClient = createApolloClient();
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
    return __CLIENT_SERVICE__;
};
