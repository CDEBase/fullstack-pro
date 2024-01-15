import { ClientTypes } from '@common-stack/core';
import { createClientContainer } from '../../config/client.service';

// Middleware to attach child container to the request and clean up after response
export const containerMiddleware = (req, res, next) => {
    const { container, serviceFunc, logger, apolloClient } = createClientContainer(req, res);
    // req.container = clientContainer.container;
    req.container = container;
    req.apolloClient = apolloClient;
    req.serviceFunc = serviceFunc;
    req.logger = logger;
    // Cleanup logic after the response is sent
    res.on('finish', () => {
        try {
            // Dispose of the child container to release resources
            // req.container.unbindAll();
            // req.container = null;
            if (req.container.isBound(ClientTypes.ApolloClient)) {
                req.container.unbind(ClientTypes.ApolloClient);
            }
            if (req.container.isBound(ClientTypes.InMemoryCache)) {
                req.container.unbind(ClientTypes.InMemoryCache);
            }
            if (req.container.isBound(ClientTypes.ApolloClientFactory)) {
                req.container.unbind(ClientTypes.ApolloClientFactory);
            }
        } catch (error) {
            console.log('container stats', req.container);
            console.error('Error during container cleanup:', error);
        }
    });

    next();
};
