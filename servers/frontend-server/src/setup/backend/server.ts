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

export default server;
