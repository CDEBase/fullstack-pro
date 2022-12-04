import { useServer } from 'graphql-ws/lib/use/ws';
import { GraphQLSchema, parse, getOperationAST, GraphQLError, validate } from 'graphql';
import { GraphQLServerOptions } from 'apollo-server-core/dist/graphqlOptions';
import { Context } from 'apollo-server-core';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { CdmLogger } from '@cdm-logger/core';
import { Disposable, SubscribeMessage } from 'graphql-ws';
import { WebSocketServer } from 'ws';
import { IModuleService } from '../interfaces';
import { createContextFromConnectionParams } from './utils';

type ILogger = CdmLogger.ILogger;

// @workaround as the `dataSources` not available in Subscription (websocket) Context.
// https://github.com/apollographql/apollo-server/issues/1526 need to revisit in Apollo-Server v3.
const constructDataSourcesForSubscriptions = (context, cache, dataSources) => {
    const intializeDataSource = (instance) => {
        instance.initialize({ context, cache });
    };
    // tslint:disable-next-line:forin
    for (const prop in dataSources) {
        // tslint:disable-next-line:no-console
        intializeDataSource(dataSources[prop]);
    }
    return dataSources;
};

/**
 * Accept only subscription operations
 * Code from graphql-ws recipes:
 * https://github.com/enisdenjo/graphql-ws/blob/master/README.md#recipes
 */
function allowOnlySub(schema: GraphQLSchema, msg: SubscribeMessage) {
    // construct the execution arguments
    const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
    };

    const operationAST = getOperationAST(args.document, args.operationName);
    if (!operationAST) {
        // returning `GraphQLError[]` sends an `ErrorMessage` and stops the subscription
        return [new GraphQLError('Unable to identify operation')];
    }

    // handle mutation and query requests
    if (operationAST.operation !== 'subscription') {
        // returning `GraphQLError[]` sends an `ErrorMessage` and stops the subscription
        // return [new GraphQLError('Only subscription operations are supported')];

        // or if you want to be strict and terminate the connection on illegal operations
        throw new Error('Only subscription operations are supported');
    }

    // dont forget to validate
    const errors = validate(args.schema, args.document);
    if (errors.length > 0) {
        // returning `GraphQLError[]` sends an `ErrorMessage` and stops the subscription
        return errors;
    }

    // ready execution arguments
    return args;
}

export class GraphqlWs {
    private subscriptionServer: Disposable;

    private logger: ILogger;

    constructor(
        private wsServer: WebSocketServer,
        private moduleService: IModuleService,
        protected cache: RedisCache | RedisClusterCache,
    ) {}

    public create() {
        this.subscriptionServer = useServer(
            {
                schema: this.moduleService.schema,
                // Adding a context property lets you add data to your GraphQL operation context
                context: async (ctx) => {
                    // Returning an object here will add that information to our
                    // GraphQL context, which all of our resolvers have access to.
                    // ctx is the `graphql-ws` Context where connectionParams live
                    try {
                        const pureContext = await this.moduleService.createContext(ctx.connectionParams, null);
                        const contextServices = await this.moduleService.serviceContext(ctx.connectionParams, null);
                        const context = {
                            ...contextServices,
                            ...pureContext,
                            preferences: this.moduleService.defaultPreferences,
                            // update: updateContainers,
                            ...ctx,
                        };
                        const addons = {
                            dataSources: constructDataSourcesForSubscriptions(
                                context,
                                this.cache,
                                this.moduleService.dataSource,
                            ),
                        };
                        return {
                            ...context,
                            ...addons,
                            ...ctx,
                            ...pureContext,
                            preferences: this.moduleService.defaultPreferences,
                        };
                    } catch (err) {
                        this.logger.error(err);
                    }
                },
                // onConnect: async (ctx) => {
                //     // do anything when connected
                // },
                // onOperation: (ctx, msg) => {

                // }
                // onOperation: async (message: { payload: any }, connection: ExecutionParams) => {
                //     connection.formatResponse = (value: ExecutionResult) => ({
                //         ...value,
                //         errors:
                //             value.errors &&
                //             formatApolloErrors([...value.errors], {
                //                 formatter: this.requestOptions.formatError,
                //                 debug: this.requestOptions.debug,
                //             }),
                //     });
                //     let context: Context = this.context ? this.context : { connection };
                //     try {
                //         context =
                //             typeof this.context === 'function'
                //                 ? await this.context({ connection, payload: message.payload })
                //                 : context;
                //     } catch (e) {
                //         throw formatApolloErrors([e], {
                //             formatter: this.requestOptions.formatError,
                //             debug: this.requestOptions.debug,
                //         })[0];
                //     }

                //     return { ...connection }; // TODO: we didn't add `context`
                // },
            },
            this.wsServer,
        );
        return this.subscriptionServer;
    }

    public disconnect() {
        if (this.subscriptionServer) {
            this.subscriptionServer.dispose();
        }
    }
}
