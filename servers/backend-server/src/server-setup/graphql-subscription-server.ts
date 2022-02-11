import { SubscriptionServer, ConnectionContext, ExecutionParams } from 'subscriptions-transport-ws';
import { execute, subscribe, ExecutionResult } from 'graphql';
// import { GraphQLServerOptions } from 'apollo-server-core';
import { formatApolloErrors } from 'apollo-server-errors';
import { GraphQLServerOptions } from 'apollo-server-core/dist/graphqlOptions';
import { Context } from 'apollo-server-core';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { CdmLogger } from '@cdm-logger/core';
import { IModuleService } from '../interfaces';
import { createContextFromConnectionParams } from './utils';

type ILogger = CdmLogger.ILogger;

export class GraphqlSubscriptionServer {
    private subscriptionServer: SubscriptionServer;

    private context: Context;

    private logger: ILogger;

    constructor(
        private moduleService: IModuleService,
        private cache: RedisCache | RedisClusterCache,
        private requestOptions: Partial<GraphQLServerOptions<any>> = Object.create(null),
    ) {
        this.logger = this.moduleService.logger.child({ className: 'GraphqlSubscriptionServer' });
    }

    public create() {
        this.subscriptionServer = SubscriptionServer.create(
            {
                schema: this.moduleService.schema as any,
                execute,
                subscribe,
                onConnect: async (connectionParams: any, webSocket: any, ctx: ConnectionContext) => {
                    try {
                        // @ts-ignore
                        extra.context = await createContextFromConnectionParams(
                            connectionParams,
                            webSocket,
                            this.moduleService,
                            this.cache,
                            this.logger,
                        );
                    } catch (e) {
                        this.logger.error(e);
                    }
                },
                onOperation: async (message: { payload: any }, connection: ExecutionParams) => {
                    connection.formatResponse = (value: ExecutionResult) => ({
                        ...value,
                        errors:
                            value.errors &&
                            formatApolloErrors([...value.errors], {
                                formatter: this.requestOptions.formatError,
                                debug: this.requestOptions.debug,
                            }),
                    });
                    let context: Context = this.context ? this.context : { connection };
                    try {
                        context =
                            typeof this.context === 'function'
                                ? await this.context({ connection, payload: message.payload })
                                : context;
                    } catch (e) {
                        throw formatApolloErrors([e], {
                            formatter: this.requestOptions.formatError,
                            debug: this.requestOptions.debug,
                        })[0];
                    }

                    return { ...connection }; // TODO: we didn't add `context`
                },
            },
            {
                noServer: true,
            },
        );
        return this.subscriptionServer;
    }

    public disconnect() {
        if (this.subscriptionServer) {
            this.subscriptionServer.close();
        }
    }
}
