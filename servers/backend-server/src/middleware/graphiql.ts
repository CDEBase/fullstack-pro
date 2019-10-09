import expressPlayground from 'graphql-playground-middleware-express';
import { GRAPHQL_ROUTE } from '../ENDPOINTS';
import { config } from '../config';
import { logger } from '@cdm-logger/server';

const subscriptionUrl = (config.GRAPHQL_URL).replace(/^http/, 'ws');
logger.debug('subscriptionUrl used is (%s)', subscriptionUrl);

export const graphiqlExpressMiddleware =
    expressPlayground({
        endpoint: GRAPHQL_ROUTE,
        subscriptionEndpoint: subscriptionUrl,
        tabs: [
            {
                endpoint: '/graphql',
                query:
                '{\n' +
                '  count {\n' +
                '    amount\n' +
                '  }\n' +
                '}',
            },
        ],
    });
