import {GraphQLSchema} from 'graphql';
import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';
import { resolvers, typeDefs } from '@sample/schema';

const schema: GraphQLSchema = makeExecutableSchema({
  logger: console,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
  resolvers: resolvers,
  typeDefs: typeDefs,
});
addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,
});

export {schema};
