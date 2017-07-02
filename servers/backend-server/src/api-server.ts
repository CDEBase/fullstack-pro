/// <reference path='../../../typings/index.d.ts' />
/// <reference types="webpack-env" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { invert, isArray } from 'lodash';
import { GRAPHIQL_ROUTE, GRAPHQL_ROUTE } from './ENDPOINTS';
import * as Webpack from 'webpack';

import { corsMiddleware } from './middleware/cors';
import { graphqlExpressMiddleware } from './middleware/graphql';
import { graphiqlExpressMiddleware } from './middleware/graphiql';
import { persistedQueryMiddleware } from './middleware/persistedQuery';
import { addGraphQLSubscriptions } from './api/subscriptions';
import { app as settings } from '../../../app.json';

import { logger } from '../../../tools/logger';

let server;
const app = express();

const port = process.env.PORT || settings.apiPort;

// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (settings.persistGraphQL && process.env.NODE_ENV !== 'test') {
    // PersistedQuery don't work yet
    // app.use(GRAPHQL_ROUTE, persistedQueryMiddleware);
}
app.use(corsMiddleware);
app.use(GRAPHQL_ROUTE, graphqlExpressMiddleware);
app.use(GRAPHIQL_ROUTE, graphiqlExpressMiddleware);


server = http.createServer(app);

addGraphQLSubscriptions(server);

server.listen(port, () => {
    logger.info(`API is now running on port ${port}`);
});

server.on('close', () => {
    server = undefined;
});

if (module.hot) {
    module.hot.dispose(() => {
        try {
            if (server) {
                server.close();
            }
        } catch (error) {
            logger.error(error.stack);
        }
    });

    module.hot.accept(['./api/subscriptions'], () => {
        try {
            addGraphQLSubscriptions(server);
        } catch (error) {
            logger.error(error.stack);
        }
    });

    module.hot.accept();
}

export default server;
