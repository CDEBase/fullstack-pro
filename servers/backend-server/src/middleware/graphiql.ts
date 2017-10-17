import { graphiqlExpress } from 'graphql-server-express';
import * as url from 'url';
import { options as settings } from '../../../../..spinrc.json';
import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import * as express from 'express';

const { port, pathname, hostname } = url.parse(process.env.GRAPHQL_URL || __BACKEND_URL__);

const subscriptionUrl = `ws://${hostname}:${port}${pathname || GRAPHQL_ROUTE}`;

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
