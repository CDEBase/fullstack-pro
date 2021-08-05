/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { ApolloClient, ApolloClientOptions, ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
// import * as schema from '../schema/schema.graphql';
import { resolvers } from '../resolvers';
import { dataIdFromObject } from '../id-generation';

const defaultSchema = `
type Query {
    dummy: Int
}
type Mutation {
    dummy: Int
}
`;

const cache = new InMemoryCache({
    dataIdFromObject: (object) => getDataIdFromObject(object),
});

const  params: ApolloClientOptions<any> = {
    cache,
    resolvers,
    // typeDefs: defaultSchema.concat(schema as any), // if client schema exist
};
const links = [];

const client = new ApolloClient({
    queryDeduplication: true,
    link: ApolloLink.from(links),
    cache,
});

function getDataIdFromObject(result: any) {
    if (dataIdFromObject[result.__typename]) {
        return dataIdFromObject[result.__typename](result);
    }
    return result.id || result._id;
}

export { client, getDataIdFromObject };
