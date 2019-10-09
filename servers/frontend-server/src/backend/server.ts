///<reference types="webpack-env" />

import express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';
import 'isomorphic-fetch';
import { logger } from '@cdm-logger/server';
import { websiteMiddleware } from './website';
import { corsMiddleware } from './middlewares/cors';
import { errorMiddleware } from './middlewares/error';
import { config } from '../config';
const cookiesMiddleware = require('universal-cookie-express');
import modules from './modules';

let server;

const app = express();

app.use(corsMiddleware);
for (const applyBeforeware of modules.beforewares) {
    applyBeforeware(app);
}

app.use(cookiesMiddleware());


// By default it uses backend_url port, which may conflict with graphql server.
const { port: serverPort } = url.parse(config.LOCAL_BACKEND_URL);

// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    '/',
    express.static(path.join(__FRONTEND_BUILD_DIR__, 'web'), {
        maxAge: '180 days',
    }),
);


if (__DEV__) {
    app.use('/', express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
}

app.use(websiteMiddleware);

if (__DEV__) {
    app.use(errorMiddleware);
}

server = http.createServer(app);

server.listen(serverPort, () => {
    logger.info(`Client Server is now running on port ${serverPort}`);
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
    module.hot.accept(['./website'], () => {
        logger.debug('...reloading middleware');
    });

    module.hot.accept();
}


export default server;
