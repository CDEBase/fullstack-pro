import 'reflect-metadata';

import { graphql } from 'graphql';
import 'jest';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { resolvers, typeDefs, database } from '../index';


const { persons, findPerson, addPerson } = database;

const graphqlFiles = (<any>require).context('./', true, /\**.graphql?/);
const graphqls = graphqlFiles.keys().map((graphqlName) => {
  return graphqlFiles(graphqlName);
});

const mainDefs = graphqls.map(m => m).reduce((prev, cur) => prev.concat('\n' + cur), '\n').concat('\n' + typeDefs);
console.log(mainDefs);

console.log(resolvers);

const schema: GraphQLSchema = makeExecutableSchema({
  logger: console,
  resolverValidationOptions: {
    requireResolversForAllFields: true,
  },
  resolvers: resolvers(null),
  typeDefs: mainDefs,
});
addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,

});

function assertNoError(res) {
  if (res.errors) {
    console.error(res.errors);
    expect(typeof res.errors).toBe('undefined');
  }
}

describe('Schema', () => {
  it('should export valid schema', () => {
    let query = schema.getQueryType();
    expect(typeof query).toBe('object');

    let fields: any = query.getFields();
    expect(typeof fields).toBe('object');
  });

});
describe('Person API ', () => {
  it('should find a person correctly', () => {
    let testQuery = `{
             getPerson(id: '3'){
                name
                id
            }
        }`;

    return graphql(schema, testQuery, undefined, { persons, findPerson, addPerson }).then((res) => {
      assertNoError(res);
      expect(res.data).toMatchSnapshot();
    });
  });

  it('should find a person and drill down matches (2 levels) correctly', () => {
    let testQuery = `{
             getPerson(id: '3'){
                name
                id
                matches {
                    id
                    matches {
                        name
                    }
                }
            }
        }`;

    return graphql(schema, testQuery, undefined, { persons, findPerson, addPerson }).then((res) => {
      assertNoError(res);
      expect(res.data).toMatchSnapshot();
    });
  });

  it('should add a person and retrieve it correctly', () => {
    let testQuery = `mutation {
            addPerson(name:'kuku', sex: 'male') {
                id
            }
        }`;

    return graphql(schema, testQuery, undefined, { persons, findPerson, addPerson }).then((res) => {
      assertNoError(res);
      let newId = res.data['addPerson'].id;
      let testVerifyQuery = `{
                getPerson(id: '${newId}'){
                        id
                        name
                    }
                }`;
      return graphql(schema, testVerifyQuery, undefined, { persons, findPerson, addPerson }).then((response) => {
        expect(response.data['getPerson'].id).toEqual(newId);
        expect(response.data['getPerson'].name).toEqual('kuku');
      });
    });
  });

});

describe('Counter example API works', () => {
  let server, apollo;


});
