import {GraphQLSchema} from 'graphql';
import {makeExecutableSchema, addMockFunctionsToSchema, addErrorLoggingToSchema} from 'graphql-tools';
import { resolvers, typeDefs } from '@sample/schema';
const rootSchemaDef = require('./root_schema.graphqls');
import { logger } from '../../../../src/logger';

const schema: GraphQLSchema = makeExecutableSchema({
  logger: console,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
  resolvers: resolvers,
  typeDefs: [rootSchemaDef].concat(typeDefs),
});

addErrorLoggingToSchema(schema, { log: (e) => logger.error(e) });

addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,
});


export {schema};
