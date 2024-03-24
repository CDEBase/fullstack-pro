/* eslint-disable jest/require-hook */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { ClientTypes } from '@common-stack/client-core';
import { Container, interfaces } from 'inversify';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { CdmLogger } from '@cdm-logger/core';
import { merge } from 'lodash';
import modules, { UtilityClass, logger } from '../modules';
import { createApolloClient } from './base-apollo-client';
import { PUBLIC_SETTINGS } from './public-config';

let __CLIENT_SERVICE__: {
    apolloClient: ApolloClient<any>;
    container: Container;
    serviceFunc: () => any;
    logger: CdmLogger.ILogger;
};
const initialState = __CLIENT__ ? { ...window.__APOLLO_STATE__ } : {};
const utility = new UtilityClass(modules);

const container = modules.createContainers({}) as Container;
container.bind(ClientTypes.Logger).toConstantValue(logger);
container.bind(ClientTypes.UtilityClass).toConstantValue(utility);

export const createClientContainer = (req?: any, res?: any) => {
    logger.debug('Calling CreateClientContainer');

    // const childContainer = container.createChild();
    const childContainer = container;

    childContainer
        .bind(ClientTypes.ApolloClient)
        .toDynamicValue((context) => new Error('Too early to bind ApolloClient'))
        .inRequestScope();
    childContainer
        .bind<() => ApolloClient<NormalizedCacheObject>>(ClientTypes.ApolloClientFactory)
        .toFactory<ApolloClient<NormalizedCacheObject>>((context: interfaces.Context) => () => {
            const newClient = childContainer.get<ApolloClient<NormalizedCacheObject>>(ClientTypes.ApolloClient);
            return newClient;
        });
    const services = merge(
        { container: childContainer },
        ...modules.createServiceFunc.map((serviceFunc) => serviceFunc(childContainer)),
    );
    const clientState = modules.getStateParams({
        resolverContex: () => services,
        container: childContainer,
        requestResponsePair: {
            req,
            res
        }
    });
    const { apolloClient, cache } = createApolloClient({
        httpGraphqlURL: PUBLIC_SETTINGS.GRAPHQL_URL,
        httpLocalGraphqlURL: PUBLIC_SETTINGS.LOCAL_GRAPHQL_URL as any,
        isDev: process.env.NODE_ENV === 'development',
        isDebug: __DEBUGGING__,
        isSSR: __SSR__,
        scope: __CLIENT__ ? 'browser' : 'server',
        clientState,
        getDataIdFromObject: (result) => modules.getDataIdFromObject(result),
        initialState,
        logger,
    });
    childContainer
        .bind(ClientTypes.InMemoryCache)
        .toDynamicValue((context) => cache)
        .inRequestScope();
    childContainer
        .rebind(ClientTypes.ApolloClient)
        .toDynamicValue((context) => apolloClient)
        .inRequestScope();

    // const services = serviceFunc();
    const serviceFunc = () => services;
    (apolloClient as any).container = services;
    __CLIENT_SERVICE__ = {
        container: childContainer,
        apolloClient,
        serviceFunc,
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
