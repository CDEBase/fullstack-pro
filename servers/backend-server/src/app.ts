/// <reference path='../../../typings/index.d.ts' />
/// <reference types="webpack-env" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { invert, isArray } from 'lodash';
import { GRAPHIQL_ROUTE, GRAPHQL_ROUTE } from './ENDPOINTS';
import * as Webpack from 'webpack';
import { corsMiddleware } from './middleware/cors';
import { graphqlExpressMiddleware } from './middleware/graphql';
import { graphiqlExpressMiddleware } from './middleware/graphiql';
import { errorMiddleware } from './middleware/error';
import { logger } from '@cdm-logger/server';
import modules from './modules';
const cookiesMiddleware = require('universal-cookie-express');


const app: express.Express = express();
const graphqlServer: any = graphqlExpressMiddleware();


for (const applyBeforeware of modules.beforewares) {
    applyBeforeware(app);
}

app.use(cookiesMiddleware());



// Don't rate limit heroku
app.enable('trust proxy');



// app.use(corsMiddleware);
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', JSON.stringify(true));
    res.header('Access-Control-Allow-Origin', req.headers.origin as string);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    next();
});

const corsOptions = {
    credentials: true,
    origin: true,
};


for (const applyMiddleware of modules.middlewares) {
    applyMiddleware(app);
}

graphqlServer.applyMiddleware({
    app,
    path: GRAPHQL_ROUTE,
    cors: corsOptions,
});

app.use(GRAPHIQL_ROUTE, graphiqlExpressMiddleware);




if (__DEV__) {
    app.use(errorMiddleware);
}

export default app;
export { graphqlServer };
