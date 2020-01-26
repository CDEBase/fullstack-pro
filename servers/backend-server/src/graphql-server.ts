
import { ApolloServer } from 'apollo-server-express';
import 'isomorphic-fetch';
import { logger } from '@cdm-logger/server';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import modules, { serviceContext, updateContainers } from './modules';
import { config } from './config';

let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug') {
    debug = true;
}

const redisCache = config.REDIS_CLUSTER_ENABLED ? new RedisClusterCache(config.REDIS_CLUSTER_URL as any[])
: config.REDIS_SENTINEL_ENABLED ? new RedisCache(config.REDIS_CLUSTER_URL) : new RedisCache(config.REDIS_URL as any);
const dataSources =  modules.createDataSource();
const defaultPreferences = modules.createDefaultPreferences();
const constructDataSourcesForSubscriptions = (context) => {
    const intializeDataSource = (instance) => {
        instance.initialize({ context, cache: redisCache });
        return instance;
    };
    // tslint:disable-next-line:forin
    for (let prop in dataSources) {
        // tslint:disable-next-line:no-console
         intializeDataSource(dataSources[prop]);
    }
    return dataSources;
};
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
        dataSources: () => dataSources,
        cache: redisCache,
        context: async ({ req, res, connection }: { req: Express.Request, res: Express.Response, connection: any}) => {
            let context, addons = {};
            try {
                if (connection) {
                    context = connection.context;
                    addons = {
                        dataSources: constructDataSourcesForSubscriptions(connection.context),
                    };
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
                ...addons,
            };

        },
    });
    apolloServer.applyMiddleware({ app, disableHealthCheck: false, path: graphqlEndpoint });
    apolloServer.installSubscriptionHandlers(httpServer);

    return apolloServer;
};
