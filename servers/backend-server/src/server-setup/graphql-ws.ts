/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */
import { useServer } from 'graphql-ws/lib/use/ws';
import {
    execute,
    subscribe,
    ExecutionResult,
    GraphQLSchema,
    parse,
    getOperationAST,
    GraphQLError,
    validate,
} from 'graphql';
// import { GraphQLServerOptions } from 'apollo-server-core';
import { GraphQLServerOptions } from 'apollo-server-core/dist/graphqlOptions';
import { Context } from 'apollo-server-core';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { CdmLogger } from '@cdm-logger/core';
import { Disposable, SubscribeMessage } from 'graphql-ws';
import * as WebSocket from 'ws';
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

    private context: Context;

    private logger: ILogger;

    constructor(
        private moduleService: IModuleService,
        private cache: RedisCache | RedisClusterCache,
        private websocket: WebSocket.Server,
        private requestOptions: Partial<GraphQLServerOptions<any>> = Object.create(null),
    ) {
        this.logger = this.moduleService.logger.child({ className: 'GraphqlSubscriptionServer' });
    }

    public create() {
        this.subscriptionServer = useServer(
            {
                schema: this.moduleService.schema as any,
                execute,
                subscribe,
                onConnect: async ({ connectionParams, extra }) => {
                    try {
                        // @ts-ignore
                        extra.context = await createContextFromConnectionParams(
                            connectionParams,
                            extra,
                            this.moduleService,
                            this.cache,
                            this.logger,
                        );
                    } catch (e) {
                        this.logger.error(e);
                    }
                },
                onSubscribe: async (ctx, msg) => allowOnlySub(this.moduleService.schema, msg),
                // onOperation: async (message: { payload: any }, connection: ExecutionParams) => {
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
            this.websocket,
        );
    }

    public disconnect() {
        if (this.subscriptionServer) {
            this.subscriptionServer.dispose();
        }
    }
}
