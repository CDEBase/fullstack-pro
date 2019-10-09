
import { DataProxy } from 'apollo-cache';
import { ApolloClient } from 'apollo-client';

export interface MyContext {
  cache: DataProxy;
  getCacheKey: (options: { __typename: string; resource?: string, id?: string }) => string;
  apolloClient: ApolloClient<any>;
}
