import { graphiqlExpress } from 'graphql-server-express';
import * as url from 'url';
import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import * as express from 'express';
import { SETTINGS } from '../config';
import { logger } from '@sample-stack/utils';

const subscriptionUrl = (SETTINGS.GRAPHQL_URL).replace(/^http/, 'ws');
logger.debug('subscriptionUrl used is (%s)', subscriptionUrl);

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
