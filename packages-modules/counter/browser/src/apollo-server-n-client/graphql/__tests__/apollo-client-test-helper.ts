import ApolloClient from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import * as schema from '../schema/schema.graphql';
import { resolvers, defaults } from '../resolvers';

const defaultSchema = `
type Query {
    dummy: Int
}
type Mutation {
    dummy: Int
}
`;

const cache = new InMemoryCache();

const linkState = withClientState({
    cache,
    resolvers,
    defaults,
    // typeDefs: defaultSchema.concat(schema),
});
const links = [linkState];

const client = new ApolloClient({
    queryDeduplication: true,
    // dataIdFromObject: (result) => modules.getDataIdFromObject(result),
    link: ApolloLink.from(links),
    cache,
});

export {
    client,
};



