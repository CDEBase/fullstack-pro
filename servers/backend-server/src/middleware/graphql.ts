
import { graphqlExpress, ExpressHandler } from 'graphql-server-express';
import { GraphQLOptions } from 'graphql-server-core';
import 'isomorphic-fetch';
import { logger } from '@sample-stack/utils';
import * as express from 'express';
import { counterRepo } from '../container';
import { schema } from '../api/schema';
import { database } from '@sample-stack/graphql-schema';
import { ICounterRepository, TYPES as CounterTypes } from '@sample-stack/store';
import modules from '@sample-stack/counter/lib/server'; //TODO change

const { persons, findPerson, addPerson } = database;
let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug' ) {
    debug = true;
}
export const graphqlExpressMiddleware =
    graphqlExpress(async (request: express.Request, response: express.Response) => {
        try {
            const context = await modules.createContext(request, response);

            const graphqlOptions: GraphQLOptions = {
                debug,
                schema,
                context: {
                    ...context,
                    persons,
                    findPerson,
                    addPerson,
                    Count: counterRepo,
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
