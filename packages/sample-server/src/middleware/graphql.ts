import { graphqlExpress, ExpressHandler } from 'graphql-server-express';
import { GraphQLOptions } from 'graphql-server-core';
import 'isomorphic-fetch';
import { logger } from '../../../../src/logger';
import * as express from 'express';

import { schema } from '../api/schema';
import { database } from '@sample/schema';

const { persons, findPerson, addPerson } = database;

export const graphqlExpressMiddleware =
    graphqlExpress((request: express.Request, response: express.Response,) => {
        try {
            const graphqlOptions: GraphQLOptions = {
                schema,
                context: {
                    persons,
                    findPerson,
                    addPerson,
                },
            };
            return graphqlOptions;
        } catch (e) {
            logger.error(e.stack);
        }
    });