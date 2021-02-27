
import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import 'isomorphic-fetch';
import { Express } from 'express';
import * as http from 'http';
import { GRAPHQL_ROUTE } from '../constants';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { IModuleService } from '../interfaces';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;

let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug') {
    debug = true;
}

// @workaround as the `dataSources` not available in Subscription (websocket) Context.
// https://github.com/apollographql/apollo-server/issues/1526 need to revisit in Apollo-Server v3.
const constructDataSourcesForSubscriptions = (context, cache, dataSources) => {
    const intializeDataSource = (instance) => {
        instance.initialize({ context, cache });
    };
    // tslint:disable-next-line:forin
    for (let prop in dataSources) {
        // tslint:disable-next-line:no-console
        intializeDataSource(dataSources[prop]);
    }
    return dataSources;
};


export class GraphqlServer {

    private logger: ILogger;
    constructor(
        private app: Express,
        private httpServer: http.Server,
        private cache: RedisCache | RedisClusterCache,
        private moduleService: IModuleService,
        private enableSubscription = true,
    ) {
        this.logger = this.moduleService.logger.child({ className: 'GraphqlServer' });
    }


    public async initialize() {
        this.logger.info('GraphqlServer initializing...');
        const apolloServer = this.configureApolloServer();
        apolloServer.applyMiddleware({ app: this.app, disableHealthCheck: false, path: GRAPHQL_ROUTE });
        if (this.enableSubscription) {
            apolloServer.installSubscriptionHandlers(this.httpServer);
        }
        this.logger.info('GraphqlServer initialized');
    }

    private configureApolloServer(): ApolloServer {
        const serverConfig: ApolloServerExpressConfig = {
            debug,
            schema: this.moduleService.schema as any,
            dataSources: () => this.moduleService.dataSource,
            cache: this.cache,
            context: async ({ req, res, connection }: { req: Express.Request, res: Express.Response, connection: any }) => {
                let context, addons = {};
                try {
                    if (connection) {
                        context = connection.context;
                        if (!context.dataSources) {
                            addons = {
                                // @workaround for apollo server issue #1526
                                dataSources: constructDataSourcesForSubscriptions
                                    (connection.context, this.cache, this.moduleService.dataSource),
                            };
                        } else {
                            addons = {
                                // @workaround for apollo server issue #1526
                                dataSources: context.dataSources,
                            };
                        }
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
