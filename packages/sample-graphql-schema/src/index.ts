import {GraphQLSchema} from 'graphql';
import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';
import { persons, findPerson, addPerson } from './data-base/person-database';

/* tslint:disable:no-var-requires */
const modules = [
  require('./modules/mocked-type'),
  require('./modules/some-type'),
  require('./modules/person-type'),
  require('./modules/query'),
  require('./modules/mutation'),
];

const mainDefs = [`
    schema {
        query: Query,
        mutation: Mutation
    }
`,
];

const resolvers = Object.assign({},
  ...(modules.map((m) => m.resolver).filter((res) => !!res)));

const typeDefs = mainDefs.concat(modules.map((m) => m.typeDef).filter((res) => !!res));

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

const database = { persons, addPerson, findPerson};
export {resolvers, typeDefs, database};
