
import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import 'isomorphic-fetch';
import { Express } from 'express';
import * as http from 'http';
import { GRAPHQL_ROUTE } from '../constants';
import * as ILogger from 'bunyan';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { IModuleService } from '../interfaces';

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

    private httpServer: http.Server;

    private logger: ILogger;
    constructor(app: Express, httpServer: http.Server, private cache: RedisCache | RedisClusterCache,
        private moduleService: IModuleService, private enableSubscription = true) {
        this.logger = this.moduleService.logger.child({ className: 'GraphqlServer' });
        this.app = app;
        this.httpServer = httpServer;
    }


    public async initialize() {
        this.logger.info('GraphqlServer initialize');
        const apolloServer = this.configureApolloServer();
        apolloServer.applyMiddleware({ app: this.app, disableHealthCheck: false, path: GRAPHQL_ROUTE });
        if (this.enableSubscription) {
            apolloServer.installSubscriptionHandlers(this.httpServer);
        }
    }

    private configureApolloServer(): ApolloServer {
        const serverConfig: ApolloServerExpressConfig = {
            debug,
            schema: this.moduleService.schema,
            dataSources: () => this.moduleService.dataSource,
            cache: this.cache,
            context: async ({ req, res, connection }: { req: Express.Request, res: Express.Response, connection: any }) => {
                let context, addons = {};
                try {
                    if (connection) {
                        context = connection.context;
                        addons = {
                            dataSources: constructDataSourcesForSubscriptions
                                (connection.context, this.cache, this.moduleService.dataSource),
                        };
                    } else {
                        const pureContext = await this.moduleService.createContext(req, res);
                        const contextServices = await this.moduleService.serviceContext(req, res);
                        context = {
                            ...pureContext,
                            ...contextServices,
                            preferences: this.moduleService.defaultPreferences,
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
        };
        if (this.enableSubscription) {
            serverConfig.subscriptions = {
                onConnect: async (connectionParams, webSocket) => {
                    this.logger.debug(`Subscription client connected using built-in SubscriptionServer.`);
                    const pureContext = await this.moduleService.createContext(connectionParams, webSocket);
                    const contextServices = await this.moduleService.serviceContext(connectionParams, webSocket);
                    return {
                        ...contextServices,
                        ...pureContext,
                        preferences: this.moduleService.defaultPreferences,
                        // update: updateContainers,
                    };
                },
                // onDisconnect: () => {},
            };
        }
        return new ApolloServer(serverConfig);
    }
}
