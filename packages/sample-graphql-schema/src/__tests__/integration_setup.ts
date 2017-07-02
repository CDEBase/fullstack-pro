import * as WebSocket from 'ws';
import { createNetworkInterface, ApolloClient } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { addApollLogging } from 'apollo-logger';

let server;
let apollo;

beforeAll(async () => {


    const wsClient = new SubscriptionClient(`ws://localhost:${process.env['PORT']}`, {}, WebSocket);

    const networkInterface = addGraphQLSubscriptions(
        createNetworkInterface({ uri: `http://localhost:${process.env['PORT']}/graphql`}),
        wsClient,
    );

    apollo = new ApolloClient({
        networkInterface: addApollLogging(networkInterface),
    });
});

afterAll(() => {
    if (server) {
        server.close();
    }
});

export const getServer = () => server;
export const getApollo = () => apollo;
