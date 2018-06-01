import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema, addErrorLoggingToSchema } from 'graphql-tools';
import * as _ from 'lodash';
import { resolvers, typeDefs } from '@sample-stack/graphql-schema';
import { logger } from '@sample-stack/utils';
import modules from '@sample-stack/counter/lib/server';  //TODO change
import { IResolverOptions, IDirectiveOptions } from '@common-stack/server-core';

import { GraphQLAnyObject } from './scalar';
const rootSchemaDef = require('./root-schema.graphqls');
// import rootSchemaDef from './root_schema.graphqls';

import { pubsub } from '../container';

const DefaultResolver = {
  AnyObject: GraphQLAnyObject,
};

const resolverOptions: IResolverOptions = {
  pubsub,
  logger,
};

console.log(modules.schemas);

const schema: GraphQLSchema = makeExecutableSchema({
  resolvers: _.merge(resolvers(pubsub, logger), modules.createResolvers(resolverOptions)),
  typeDefs: [rootSchemaDef].concat(typeDefs).concat(modules.schemas) as Array<any>,
});

addErrorLoggingToSchema(schema, { log: (e) => logger.error(e) });

addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,
});


export { schema };
