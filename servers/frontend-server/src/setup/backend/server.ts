///<reference types="webpack-env" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';
import { options as settings } from '../../../../../.spinrc.json';
import { logger } from '@sample-stack/utils';
import { websiteMiddleware } from './middleware';
const queryMap = require('@sample-stack/graphql/extracted_queries.json');

let server;

const app = express();

// By default it uses backend_url port, which may conflict with graphql server.
// By passing CLIENT_PORT we can run it on it own port.
const { port, pathname } = url.parse(__BACKEND_URL__);
const serverPort = process.env.CLIENT_PORT || port;

// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    '/',
    express.static(path.join(settings.frontendBuildDir, 'web'), {
        maxAge: '180 days',
    }),
);


if (__DEV__) {
    app.use('/', express.static(settings.dllBuildDir, { maxAge: '180 days' }));
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
