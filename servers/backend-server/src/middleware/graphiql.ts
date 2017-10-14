import { graphiqlExpress } from 'graphql-server-express';
import { app as settings } from '../../../../app.json';

import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import * as express from 'express';

const port = process.env.GRAPHQL_SERVER_PORT || settings.apiPort;
const subscriptionUrl = `ws://localhost:${port}${GRAPHQL_ROUTE}`;

export const graphiqlExpressMiddleware =
    graphiqlExpress({
        endpointURL: GRAPHQL_ROUTE,
        subscriptionsEndpoint: subscriptionUrl,
        query:
        '{\n' +
        '  count {\n' +
        '    amount\n' +
        '  }\n' +
        '}',
    });
