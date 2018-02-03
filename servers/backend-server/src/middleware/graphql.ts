
import { graphqlExpress, ExpressHandler } from 'graphql-server-express';
import { GraphQLOptions } from 'graphql-server-core';
import 'isomorphic-fetch';
import { logger } from '@sample-stack/utils';
import * as express from 'express';
import { counterRepo } from '../container';
import { schema } from '../api/schema';
import { database  } from '@sample-stack/graphql-schema';
import { ICounterRepository, TYPES as CounterTypes } from '@sample-stack/store';

const { persons, findPerson, addPerson } = database;

export const graphqlExpressMiddleware =
    graphqlExpress((request: express.Request, response: express.Response) => {
        try {
            const graphqlOptions: GraphQLOptions = {
                schema,
                context: {
                    persons,
                    findPerson,
                    addPerson,
                    Count: counterRepo,
                },
            };
            return graphqlOptions;
        } catch (e) {
            logger.error(e.stack);
        }
    });
