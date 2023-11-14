/* eslint-disable jest/require-hook */
import 'reflect-metadata';
import express from 'express';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';
import 'isomorphic-fetch';
import { logger } from '@cdm-logger/server';
import { websiteMiddleware } from './middlewares/website';
import { corsMiddleware } from './middlewares/cors';
import { errorMiddleware } from './middlewares/error';
import { config } from '../config';
import modules from './modules';

const cookiesMiddleware = require('universal-cookie-express');

let server;

const app = express();

app.use(corsMiddleware);
app.options('*', corsMiddleware);

for (const applyBeforeware of modules.beforewares) {
    applyBeforeware(app);
}

app.use(cookiesMiddleware());

// By default it uses backend_url port, which may conflict with graphql server.
const { port: serverPort } = url.parse(config.LOCAL_BACKEND_URL);

// Don't rate limit heroku
app.enable('trust proxy');
if (!__DEV__) {
    app.use(compression());
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    '/',
    express.static(path.join(__FRONTEND_BUILD_DIR__), {
        maxAge: '180 days',
    }),
);

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

if ((module as any).hot) {
    (module as any).hot.dispose(() => {
        try {
            if (server) {
                server.close();
            }
        } catch (error) {
            logger.error(error.stack);
        }
    });
    (module as any).hot.accept(['./website-antui', './website-chakra-antui', './website-chakra'], () => {
        logger.debug('...reloading middleware');
    });

    (module as any).hot.accept();
}

export default server;
