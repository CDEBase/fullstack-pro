import { graphiqlExpress } from 'graphql-server-express';
const { settings } = require('../../../../package.json');
import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import * as express from 'express';

const port = process.env.PORT || settings.apiPort;
const subscriptionUrl = `ws://localhost:${port}`;

export const graphiqlExpressMiddleware =
    graphiqlExpress({
        endpointURL: GRAPHQL_ROUTE,
        subscriptionsEndpoint: subscriptionUrl,
        query:
        '{\n' +
        '  count {\n' +
        '    amount\n' +
        '  }\n' +
        '}'
    });