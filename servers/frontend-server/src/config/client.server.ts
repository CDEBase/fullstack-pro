import 'reflect-metadata';
/* eslint-disable jest/require-hook */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { ClientTypes } from '@common-stack/client-core';
import { Container } from 'inversify';
import modules, { UtilityClass, logger } from '../modules';
import { createApolloClient } from './base-apollo-client';
import { config } from './browser-env-config';

const utility = new UtilityClass(modules);
const container = modules.createContainers({}) as Container;
container.bind(ClientTypes.Logger).toConstantValue(logger);
container.bind(ClientTypes.UtilityClass).toConstantValue(utility);

export const createClientContainer = (req?: any, res?: any) => {
    logger.debug('Calling CreateClientContainer');
    const childContainer = container;
    const clientState = modules.getStateParams({
        // resolverContex: () => services,
        container: childContainer,
        requestResponsePair: {
            req,
            res,
        },
    });
    const { apolloClient } = createApolloClient({
        httpGraphqlURL: config.GRAPHQL_URL,
        httpLocalGraphqlURL: config.LOCAL_GRAPHQL_URL as any,
        isDev: process.env.NODE_ENV === 'development',
        isDebug: __DEBUGGING__,
        isSSR: __SSR__,
        scope: typeof window !== 'undefined' ? 'browser' : 'server',
        clientState,
        getDataIdFromObject: (result) => modules.getDataIdFromObject(result),
        initialState: typeof window !== 'undefined' ? window?.__APOLLO_STATE__ : undefined,
        logger,
    });

    const clientService = {
        container: childContainer,
        apolloClient,
        // serviceFunc,
        logger,
    };

    return clientService;
};
