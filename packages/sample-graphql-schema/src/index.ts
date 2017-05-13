import {GraphQLSchema} from 'graphql';
import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';
import { persons, findPerson, addPerson } from './data-base/person-database';

const moduleFiles = (<any> require).context("./modules/", true, /\.ts/);

const modules = moduleFiles.keys().map((moduleName) => {
  return moduleFiles(moduleName);
});

const mainDefs = [`
    schema {
        query: Query,
        mutation: Mutation,
        subscription: Subscription
    }
`,
];

const resolvers = Object.assign({},
  ...(modules.map((m) => m.resolver).filter((res) => !!res)));

const typeDefs = mainDefs.concat(modules.map((m) => m.typeDef).filter((res) => !!res));

const database = { persons, addPerson, findPerson};
export {resolvers, typeDefs, database};
