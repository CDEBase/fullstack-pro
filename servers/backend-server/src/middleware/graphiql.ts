import { graphiqlExpress } from 'graphql-server-express';
import * as url from 'url';
import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import * as express from 'express';
import { SETTINGS } from '../config';

const { protocol, port, pathname, hostname } = url.parse(SETTINGS.GRAPHQL_URL || __BACKEND_URL__);
const subscriptionUrl = `${protocol === 'http:'? 'ws': 'wss'}://${hostname}:${port}${pathname || GRAPHQL_ROUTE}`;

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
