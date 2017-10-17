///<reference types='webpack-env' />

import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';

import { Module } from 'webpack';
import { schema } from './schema';

import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import { logger } from '@sample-stack/utils';
import { container } from '../container';
import { database } from '@sample-stack/schema';
import { ICounterRepository, TYPES as CounterTypes } from '@sample-stack/store';

let subscriptionServer;

const addSubscriptions = httpServer => {
    subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        onConnect: () => ({ Count: container.get<ICounterRepository>(CounterTypes.ICounterRepository) }),
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

