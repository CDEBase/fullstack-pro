import { GraphQLSchema } from 'graphql';
import { addApolloLogging } from 'apollo-logger';

import { makeExecutableSchema, addMockFunctionsToSchema, addErrorLoggingToSchema } from 'graphql-tools';
import { resolvers, typeDefs } from '@sample/schema';
const rootSchemaDef = require('./root_schema.graphqls');
import { logger } from '../../../../tools/logger';
import { PubSub } from 'graphql-subscriptions';
import { app as settings } from '../../../../app.json';

export const pubsub = settings.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub();


const schema: GraphQLSchema = makeExecutableSchema({

  resolvers: resolvers(pubsub),
  typeDefs: [rootSchemaDef].concat(typeDefs) as Array<any>,
});

addErrorLoggingToSchema(schema, { log: (e) => logger.error(e) });

addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,
});


export { schema };
