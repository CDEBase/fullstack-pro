
import { ApolloServer } from 'apollo-server-express';
import 'isomorphic-fetch';
// import modules, { serviceContext } from './modules';
import { Express } from 'express';
import * as http from 'http';
import { GatewaySchemaBuilder } from './api/schema-builder';
import { GraphQLSchema } from 'graphql';
import { GRAPHQL_ROUTE } from './ENDPOINTS';
import * as ILogger from 'bunyan';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';


let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug') {
    debug = true;
}


const constructDataSourcesForSubscriptions = (context, cache, dataSources) => {
    const intializeDataSource = (instance) => {
        instance.initialize({ context, cache });
        return instance;
    };
    // tslint:disable-next-line:forin
    for (let prop in dataSources) {
        // tslint:disable-next-line:no-console
        intializeDataSource(dataSources[prop]);
    }
    return dataSources;
};


export class GraphqlServer {



    private app: Express;
    private schema: GraphQLSchema;

    private httpServer: http.Server;

    private logger: ILogger;
    constructor(app: Express, httpServer: http.Server, private cache: RedisCache, private serviceBroker: {
        serviceContext: any,
        dataSource: any,
        defaultPreferences: any,
        createContext: any,
        resolvers: any,
        schema: any,
        directives: any,
        logger: ILogger,
    }) {
        this.logger = this.serviceBroker.logger.child({ className: 'GraphqlServer'});
        this.app = app;
        this.httpServer = httpServer;
    }


    public async initialize() {
        this.logger.info('GraphqlServer initialize');
        this.schema = await (new GatewaySchemaBuilder({ schema: this.serviceBroker.schema, resolvers: this.serviceBroker.resolvers,
            directives: this.serviceBroker.directives, logger: this.serviceBroker.logger,
        })).build();
        const apolloServer = this.configureApolloServer();
        apolloServer.applyMiddleware({ app: this.app, disableHealthCheck: false, path: GRAPHQL_ROUTE });
        apolloServer.installSubscriptionHandlers(this.httpServer);
    }

    private configureApolloServer(): ApolloServer {
        return new ApolloServer({
            debug,
            schema: this.schema,
            subscriptions: {
                onConnect: async (connectionParams, webSocket) => {
                    this.logger.debug(`Subscription client connected using built-in SubscriptionServer.`);
                    const pureContext = await this.serviceBroker.createContext(connectionParams, webSocket);
                    const contextServices = await this.serviceBroker.serviceContext(connectionParams, webSocket);
                    return {
                        ...contextServices,
                        ...pureContext,
                        preferences: this.serviceBroker.defaultPreferences,
                        // update: updateContainers,
                    };
                },
                // onDisconnect: () => {},
            },
            dataSources: () => this.serviceBroker.dataSource,
            cache: this.cache,
            context: async ({ req, res, connection }: { req: Express.Request, res: Express.Response, connection: any }) => {
                let context, addons = {};
                try {
                    if (connection) {
                        context = connection.context;
                        addons = {
                            dataSources: constructDataSourcesForSubscriptions
                                (connection.context, this.cache, this.serviceBroker.dataSource),
                        };
                    } else {
                        const pureContext = await this.serviceBroker.createContext(req, res);
                        const contextServices = await this.serviceBroker.serviceContext(req, res);
                        context = {
                            ...pureContext,
                            ...contextServices,
                            preferences: this.serviceBroker.defaultPreferences,
                            // update: updateContainers,
                        };
                    }
                } catch (err) {
                    this.logger.error('adding context to graphql failed due to [%o]', err);
                    throw err;
                }
                return {
                    ...context,
                    ...addons,
                };

            },
        });
    }
}
