/// <reference path='../../../typings/index.d.ts' />
/// <reference types="webpack-env" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { invert, isArray } from 'lodash';
import { GRAPHIQL_ROUTE, GRAPHQL_ROUTE } from './ENDPOINTS';
import * as Webpack from 'webpack';
import * as url from 'url';
import { corsMiddleware } from './middleware/cors';
import { graphqlExpressMiddleware } from './middleware/graphql';
import { graphiqlExpressMiddleware } from './middleware/graphiql';
import { persistedQueryMiddleware } from './middleware/persistedQuery';
import { errorMiddleware } from './middleware/error';
import { addGraphQLSubscriptions } from './api/subscriptions';
import { SETTINGS } from './config';
import { logger } from '@sample-stack/utils';
import modules from '@sample-stack/counter/lib/server'; //TODO change

let server;
const app = express();

for (const applyBeforeware of modules.beforewares) {
    applyBeforeware(app);
  }

const { protocol, port: serverPort, pathname, hostname } = url.parse(SETTINGS.BACKEND_URL);
// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (__DEV__) {
    app.use('/', express.static(SETTINGS.dllBuildDir, { maxAge: '180 days' }));
}

if (__PERSIST_GQL__) {
    // PersistedQuery don't work yet
    // app.use(GRAPHQL_ROUTE, persistedQueryMiddleware);
}
app.use(corsMiddleware);

for (const applyMiddleware of modules.middlewares) {
    applyMiddleware(app);
}

app.use(GRAPHQL_ROUTE, graphqlExpressMiddleware);
app.use(GRAPHIQL_ROUTE, graphiqlExpressMiddleware);
if (__DEV__) {
    app.use(errorMiddleware);
}

server = http.createServer(app);

addGraphQLSubscriptions(server);

server.listen(serverPort, () => {
    logger.info(`API is now running on port ${serverPort}`);
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
    module.hot.accept(['./middleware/graphql'], () => {
        logger.debug('loading ./middleware/graphql');
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
