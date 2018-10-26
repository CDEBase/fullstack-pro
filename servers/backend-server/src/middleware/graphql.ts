
import { ApolloServer, gql } from 'apollo-server-express';
import 'isomorphic-fetch';
import { logger } from '@cdm-logger/server';
import * as express from 'express';
import { localSchema, schemas } from '../api/schema';
import modules, { serviceContext } from '../modules';
import { formatError } from 'apollo-errors';


let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug') {
    debug = true;
}

export const graphqlExpressMiddleware = () =>
    new ApolloServer({
        debug,
        schema: localSchema,
        subscriptions: {
            onConnect: async (connectionParams, webSocket) => {
                const context = await modules.createContext(connectionParams, webSocket);
                const contextServices = await serviceContext(connectionParams, webSocket);
                return {
                    ...contextServices,
                    ...context,
                };
            },
        },
        dataSources: () => modules.createDataSource(),
        context: async ({ req, res, connection }) => {
            let context, contextServices;
            try {
                if (connection) {
                    context = connection.context;
                    contextServices = {};
                } else {
                    context = await modules.createContext(req, res);
                    contextServices = await serviceContext(req, res);
                }
            } catch (err) {
                logger.error('adding context to graphql failed due to [%o]', err);
                throw  err;
            }

            return {
                ...contextServices,
                ...context,
            };

        },
        formatError,
    });

