import * as WebSocket from 'ws';
import { getOperationAST } from 'graphql';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { createApolloFetch } from 'apollo-fetch';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addApolloLogging } from 'apollo-logger';
import { LoggingLink } from 'apollo-logger';

let server;
let apollo;

beforeAll(async () => {


    const fetch = createApolloFetch({ uri: `http://localhost:${process.env['PORT']}/graphql` });
    const cache = new InMemoryCache();
    let link = ApolloLink.split(
        operation => {
            const operationAST = getOperationAST(operation.query, operation.operationName);
            return !!operationAST && operationAST.operation === 'subscription';
        },
        new WebSocketLink({
            uri: `ws://localhost:${process.env['PORT']}/graphql`,
            webSocketImpl: WebSocket,
        }) as any,
        new BatchHttpLink({ fetch }) as any,
    );
    apollo = new ApolloClient({
        link: ApolloLink.from((true ? [new LoggingLink()] : []).concat([link])),
        cache,
    });
});

afterAll(() => {
    if (server) {
        server.close();
    }
});

export const getServer = () => server;
export const getApollo = () => apollo;
