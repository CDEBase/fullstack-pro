import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema, addErrorLoggingToSchema } from 'graphql-tools';
import * as _ from 'lodash';
import { logger } from '@common-stack/server-core';
import modules from '../modules';
import { IResolverOptions, IDirectiveOptions } from '@common-stack/server-core';

import { GraphQLAnyObject } from './scalar';
const rootSchemaDef = require('./root-schema.graphqls');
// import rootSchemaDef from './root_schema.graphqls';
import { settings } from '../modules/module';
import { pubsub } from '../modules/pubsub';

const DefaultResolver = {
  AnyObject: GraphQLAnyObject,
};

const resolverOptions: IResolverOptions = {
  pubsub,
  subscriptionID: `${settings.subTopic}`,
  logger,
};

const schema: GraphQLSchema = makeExecutableSchema({
  resolvers: { ...DefaultResolver, ...modules.createResolvers(resolverOptions)},
  typeDefs: [rootSchemaDef].concat(modules.schemas) as Array<any>,
});

addErrorLoggingToSchema(schema, { log: (e) => logger.error(e) });

addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,
});


export { schema };
