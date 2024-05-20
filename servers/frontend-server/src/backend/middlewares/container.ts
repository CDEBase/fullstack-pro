import { v4 as uuidv4 } from 'uuid'; // Import UUID library to generate unique identifiers
import { ClientTypes } from '@common-stack/core';

import { Container, interfaces } from 'inversify';
import { merge } from 'lodash-es';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/index.js';
import { createReduxStore } from '../../config/redux-config';
import { createClientContainer } from '../../config/client.server';
import modules from '../../modules';

export const TYPES = {
    HttpRequest: Symbol.for('HttpRequest'),
};
export const containerMiddleware = async (req, res, next) => {
    const requestId = uuidv4(); // Generate a unique identifier for the request
    console.time(`Request ${requestId} Duration`); // Start timing the request
    console.log(`Express req started - ID: ${requestId} , URL: ${req.url}`); // Log when request starts with unique ID
    
    const { container, logger, apolloClient } = createClientContainer(req, res);
    const requestContainer: Container = container.createChild();
    requestContainer.bind<Request>(TYPES.HttpRequest).toConstantValue(req);
    container.bind<Request>(TYPES.HttpRequest).toDynamicValue((context) => {
        return context.container.get<interfaces.HttpContext>(TYPE.HttpContext).request;
    }).inRequestScope();
    let count = 1;
    requestContainer
        .bind(ClientTypes.ApolloClientFactory)
        .toDynamicValue<() => ApolloClient<NormalizedCacheObject>>((context: interfaces.Context) => () => {
            console.log('---Express Container Cache ---', requestId, req.url, apolloClient.extract()?.ROOT_QUERY);
            count = count + 1;
            console.log('---COUNT__________', count);
            return apolloClient;
        })
        .inRequestScope();
    const services = merge(
        { container: requestContainer },
        ...modules.createServiceFunc.map((serviceFunc) => serviceFunc(requestContainer)),
    );

    // const resolvers = modules.getApolloResolvers(() =>  merge(
    //     { container: requestContainer },
    //     ...modules.createServiceFunc.map((serviceFunc) => serviceFunc(requestContainer)),
    // ));
    // apolloClient.setResolvers(resolvers);
    // const services = serviceFunc();
    const { store } = createReduxStore(apolloClient, services, requestContainer);
    req.container = requestContainer;
    req.apolloClient = apolloClient;
    req.logger = logger;
    req.store = store;
    req.services = services;

    res.on('finish', () => {
        console.log(`Express req Finished! - ID: ${requestId}`); // Log when request finishes with unique ID
        console.timeEnd(`Request ${requestId} Duration`); // End timing and log the duration

        try {
            // Cleanup logic here
            if (req.container) {
                // if (req.container.isBound(ClientTypes.ApolloClient)) {
                //     req.container.unbind(ClientTypes.ApolloClient);
                // }
                // if (req.container.isBound(ClientTypes.InMemoryCache)) {
                //     req.container.unbind(ClientTypes.InMemoryCache);
                // }
                // if (req.container.isBound(ClientTypes.ApolloClientFactory)) {
                //     req.container.unbind(ClientTypes.ApolloClientFactory);
                // }
                req.container = null;
            }
            req.services = null;
        } catch (error) {
            console.error(`Error during container cleanup - ID: ${requestId}`, error);
        }
    });

    next();
};
