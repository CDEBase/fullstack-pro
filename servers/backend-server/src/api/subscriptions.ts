///<reference types="webpack-env" />

import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub, SubscriptionManager } from "graphql-subscriptions";
import { addApolloLogging } from 'apollo-logger';
import { Module } from 'webpack';
import { schema, pubsub } from "./schema";
import { Observable } from 'rxjs';
const { settings } = require('../../../../package.json');
import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import { subscriptions } from '@sample/schema'
import { logger } from '../../../../tools/logger';

const manager = new SubscriptionManager({
    schema,
    pubsub,
    setupFunctions: subscriptions
});
const subscriptionManager = settings.apolloLogging ? addApolloLogging(manager): manager;

var subscriptionServer;

const addSubscriptions = httpServer => {
    let subscriptionServerConfig = {
        server: httpServer,
        path: GRAPHQL_ROUTE,
    };

    subscriptionServer = new SubscriptionServer({
        subscriptionManager
    }, subscriptionServerConfig)
};

const addGraphQLSubscriptions = httpServer => {
    if (module.hot && module.hot.data) {
        const prevServer = module.hot.data['subscriptionServer'];
        if (prevServer && prevServer.wsServer) {
            logger.debug('Reloading the subscription server.');
            prevServer.wsServer.close(() => {
                addSubscriptions(httpServer);
            })
        }
    } else {
        addSubscriptions(httpServer);
    }
};

if (module.hot) {
    module.hot.dispose(data => {
        try {
            data['subscriptionServer'] = subscriptionServer;
        } catch (error) {
            logger.error(error.stack);
        }
    });
}
export { addGraphQLSubscriptions, pubsub };

