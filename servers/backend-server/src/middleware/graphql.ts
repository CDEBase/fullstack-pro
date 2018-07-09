
import { graphqlExpress, ExpressHandler } from 'apollo-server-express';
import { GraphQLOptions } from 'graphql-server-core';
import 'isomorphic-fetch';
import { logger } from '@common-stack/server-core';
import * as express from 'express';
import { schema } from '../api/schema';
import { database } from '@sample-stack/graphql-schema';
import { ICounterRepository, TYPES as CounterTypes } from '@sample-stack/store';
import modules from '@sample-stack/counter/lib/server'; //TODO change

let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug' ) {
    debug = true;
}
const serviceContext = modules.createServiceContext({});

export const graphqlExpressMiddleware =
    graphqlExpress(async (request: express.Request, response: express.Response) => {
        try {
            const context = await modules.createContext(request, response);
            const contextServices = await serviceContext(request, response);

            const graphqlOptions: GraphQLOptions = {
                debug,
                schema,
                context: {
                    ...context,
                    ...contextServices,
                },
                formatError: error => {
                    logger.error('GraphQL execution error:', error);
                    return error;
                },
            };
            return graphqlOptions;
        } catch (e) {
            logger.error(e.stack);
        }
    });
