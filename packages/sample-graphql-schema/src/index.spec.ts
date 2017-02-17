import {graphql} from 'graphql';
import 'jest';
import {persons, findPerson, addPerson} from './data-base/person-database';
import {GraphQLSchema} from 'graphql';
import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';
import { resolvers, typeDefs } from './index';

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

  it('should resolve testString correctly', () => {
    let testQuery = `{
            testString
        }`;

    let expectedResponse = {
      testString: 'it Works!',
    };

    return graphql(schema, testQuery, undefined, {}).then((res) => {
      assertNoError(res);
      expect(res.data).toMatchSnapshot();
    });
  });

  it('should resolve someType correctly', () => {
    let testQuery = `{
            someType {
                testFloat,
                testInt,
                fixedString,
            }
        }`;

    return graphql(schema, testQuery, undefined, {}).then((res) => {
      assertNoError(res);
      expect(res.data).toMatchSnapshot();
    });
  });

  it('should resolve testStringConnector correctly', () => {
    let testQuery = `{
            testStringConnector
        }`;

    const ctx = {testConnector: {testString: 'it works from connector as well!'}};
    return graphql(schema, testQuery, undefined, ctx).then((res) => {
      assertNoError(res);
      expect(res.data).toMatchSnapshot();
    });
  });

  it('should resolve mockedObject  correctly', () => {
    let testQuery = `{
            mockedObject {
                mockedFirstName,
                mockedInt,
            }
        }`;

    return graphql(schema, testQuery, undefined, {}).then((res) => {
      let data = res.data as {
        mockedObject: {
          mockedInt: number
          mockedFirstName: string,
        },
      };

      assertNoError(res);
      expect(data.mockedObject.mockedInt).toBeGreaterThan(-1000);
      expect(data.mockedObject.mockedInt).toBeLessThan(1000);

      expect(data.mockedObject.mockedFirstName).toMatchSnapshot();
    });
  });

  it('should find a person correctly', () => {
    let testQuery = `{
             getPerson(id: "3"){
                name
                id
            }
        }`;

    return graphql(schema, testQuery, undefined, {persons, findPerson, addPerson}).then((res) => {
      assertNoError(res);
      expect(res.data).toMatchSnapshot();
    });
  });

  it('should find a person and drill down matches (2 levels) correctly', () => {
    let testQuery = `{
             getPerson(id: "3"){
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

    return graphql(schema, testQuery, undefined, {persons, findPerson, addPerson}).then((res) => {
      assertNoError(res);
      expect(res.data).toMatchSnapshot();
    });
  });

  it('should add a person and retrieve it correctly', () => {
    let testQuery = `mutation {
            addPerson(name:"kuku", sex: "male") {
                id
            }
        }`;

    return graphql(schema, testQuery, undefined, {persons, findPerson, addPerson}).then((res) => {
      assertNoError(res);
      let newId = res.data['addPerson'].id;
      let testVerifyQuery = `{
                getPerson(id: "${newId}"){
                        id
                        name
                    }
                }`;
      return graphql(schema, testVerifyQuery, undefined, {persons, findPerson, addPerson}).then((res) => {
        expect(res.data['getPerson'].id).toEqual(newId);
        expect(res.data['getPerson'].name).toEqual('kuku');
      });
    });
  });

});
