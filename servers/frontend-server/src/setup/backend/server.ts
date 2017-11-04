///<reference types="webpack-env" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';
import 'isomorphic-fetch';
import { logger } from '@sample-stack/utils';
import { websiteMiddleware } from './middleware';
import { corsMiddleware } from './cors';
import { SETTINGS } from '../../config';

let server;

const app = express();

// By default it uses backend_url port, which may conflict with graphql server.
const { port: serverPort, pathname } = url.parse(SETTINGS.CLIENT_URL || __BACKEND_URL__);

// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    '/',
    express.static(path.join(SETTINGS.frontendBuildDir, 'web'), {
        maxAge: '180 days',
    }),
);


if (__DEV__) {
    app.use('/', express.static(SETTINGS.dllBuildDir, { maxAge: '180 days' }));
}

app.use(websiteMiddleware);


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
    module.hot.accept(['./middleware'], () => {
        logger.debug('...reloading middleware');
    });

    module.hot.accept();
}


export default server;
