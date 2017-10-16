import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import { app as settings } from '../../../app.json';
import { logger } from '@sample-stack/utils';
import { websiteMiddleware } from './middleware';
const queryMap = require('@sample-stack/graphql/extracted_queries.json');

let server;

const app = express();

const port = process.env.GRAPHQL_SERVER_PORT || settings.clientPort;

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

// app.use(websiteMiddleware);
app.use(websiteMiddleware);


server = http.createServer(app);

server.listen(port, () => {
    logger.info(`Client Server is now running on port ${port}`);
});

server.on('close', () => {
    server = undefined;
});
