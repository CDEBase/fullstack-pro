import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { persons, findPerson, addPerson } from './modules/person/database';
import { ICounterRepository, ICount, TYPES as CounterTypes} from './modules/counter/database';
import { RepositoryDiSetup } from './modules/repositoryDiSetup';
import { loadSchema } from '@cdmbase/graphql-schema-collector';
import { merge } from 'lodash';

// to atomatically load the resolvers
const resolverFiles = (<any>require).context("./modules/", true, /\**resolvers.ts/);

const resolverModules = resolverFiles.keys().map((moduleName) => {
  return resolverFiles(moduleName);
});

// to automatically load the subscriptiontypes
const subscriptionFiles = (<any>require).context('./modules/', true, /\**subscriptions.ts/);

const subscriptionModules = subscriptionFiles.keys().map((moduleName) => {
  return subscriptionFiles(moduleName);
});

// to automatically resolve the graphql files
const graphqlFiles = (<any>require).context('./modules/', true, /\**.graphql?/);

const graphqls = graphqlFiles.keys().map((graphqlName) => {
  return graphqlFiles(graphqlName)
})

const resolvers = (pubsub) => resolverModules.reduce((state, m) => {
  if (!m.resolver) {
    return state;
  }
  return merge(state, m.resolver(pubsub));
}, {});

const typeDefs = graphqls.reduce((prev, cur) => prev.concat("\n" + cur), "\n");

const subscriptions = subscriptionModules.reduce((state, m) => {
  if (!m.subscription) {
    return state;
  }
  return merge(state, m.subscription);
}, {});

const database = { persons, addPerson, findPerson };

export { resolvers, typeDefs, subscriptions, database, RepositoryDiSetup, ICounterRepository, CounterTypes};
