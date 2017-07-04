import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { persons, findPerson, addPerson } from './modules/person/database';
import { ICounterRepository, ICount, TYPES as CounterTypes} from './modules/counter/database';
import { RepositoryDiSetup } from './modules/repositoryDiSetup';
import { merge } from 'lodash';
import * as Logger from 'bunyan';

// to atomatically load the resolvers
const resolverFiles = (<any>require).context('./modules/', true, /\**resolvers.ts/);

const resolverModules = resolverFiles.keys().map((moduleName) => {
  return resolverFiles(moduleName);
});

// to automatically resolve the graphql files
const graphqlFiles = (<any>require).context('./modules/', true, /\**.graphql?/);

const graphqls = graphqlFiles.keys().map((graphqlName) => {
  return graphqlFiles(graphqlName);
});

const resolvers = (pubsub, logger?: Logger) => resolverModules.reduce((state, m) => {
  if (!m.resolver) {
    return state;
  }
  return merge(state, m.resolver(pubsub, logger));
}, {});

const typeDefs = graphqls.reduce((prev, cur) => prev.concat('\n' + cur), '\n');

const database = { persons, addPerson, findPerson };

export { resolvers, typeDefs, database, RepositoryDiSetup, ICounterRepository, CounterTypes};
