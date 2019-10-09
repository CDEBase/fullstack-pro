
import { ApolloServer } from 'apollo-server-express';
import 'isomorphic-fetch';
import { logger } from '@cdm-logger/server';
import modules, { serviceContext, updateContainers } from './modules';


let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug') {
    debug = true;
}

const defaultPreferences = modules.createDefaultPreferences();
export const graphqlServer = (app, schema, httpServer, graphqlEndpoint) => {
    let apolloServer = new ApolloServer({
        debug,
        schema,
        subscriptions: {
            onConnect: async (connectionParams, webSocket) => {
                logger.debug(`Subscription client connected using built-in SubscriptionServer.`);
                const pureContext = await modules.createContext(connectionParams, webSocket);
                const contextServices = await serviceContext(connectionParams, webSocket);
                return {
                    ...contextServices,
                    ...pureContext,
                    preferences: defaultPreferences,
                    update: updateContainers,
                };
            },
            // onDisconnect: () => {},
        },
        dataSources: () => modules.createDataSource(),
        context: async ({ req, res, connection }: { req: Express.Request, res: Express.Response, connection: any}) => {
            let context;
            try {
                if (connection) {
                    context = connection.context;
                } else {
                    const pureContext = await modules.createContext(req, res);
                    const contextServices = await serviceContext(req, res);
                    context = {
                        ...pureContext,
                        ...contextServices,
                        preferences: defaultPreferences,
                        update: updateContainers,
                    };
                }
            } catch (err) {
                logger.error('adding context to graphql failed due to [%o]', err);
                throw err;
            }

            return {
                ...context,
            };

        },
    });
    apolloServer.applyMiddleware({ app, disableHealthCheck: false, path: graphqlEndpoint });
    apolloServer.installSubscriptionHandlers(httpServer);

    return apolloServer;
};
