///<reference types='webpack-env' />

import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';

import { Module } from 'webpack';
import { schema } from './schema';

import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import { logger } from '@cdm-logger/server';
import modules, { serviceContext } from '../modules';

let subscriptionServer;

const addSubscriptions = httpServer => {
    subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        onConnect: async (connectionParams, webSocket) => {
            const context = await modules.createContext(connectionParams, webSocket);
            const contextServices = await serviceContext(connectionParams, webSocket);
            return {
                ...context,
                ...contextServices,
            };
        },
        onOperation: async (message: { payload: { id_token?: string } }, params, webSocket) => {
            logger.trace('onOperation message');
            const context = await modules.createContext(null, message.payload);
            const contextServices = await serviceContext(null, message.payload);
            return {
                ...params,
                context: {
                    ...context,
                    ...contextServices,
                },
            };
        },
    }, {
            server: httpServer,
            path: GRAPHQL_ROUTE,
        });
};

const addGraphQLSubscriptions = httpServer => {
    if (module.hot && module.hot.data) {
        const prevServer = (module.hot.data as any).subscriptionServer;
        if (prevServer && prevServer.wsServer) {
            logger.debug('Reloading the subscription server.');
            prevServer.wsServer.close(() => {
                addSubscriptions(httpServer);
            });
        }
    } else {
        addSubscriptions(httpServer);
    }
};

if (module.hot) {
    module.hot.dispose(data => {
        try {
            (data as any).subscriptionServer = subscriptionServer;
        } catch (error) {
            logger.error(error.stack);
        }
    });
}
export { addGraphQLSubscriptions };

