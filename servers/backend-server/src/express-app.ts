/* eslint-disable @typescript-eslint/no-var-requires */
import * as express from 'express';

import modules from './modules';
import { errorMiddleware } from './middleware/error';
import { contextServicesMiddleware } from './middleware/services';
import { IModuleService } from './interfaces';
import { corsMiddleware } from './middleware/cors';

const cookiesMiddleware = require('universal-cookie-express');

export function expressApp(options: IModuleService, middlewares, http?) {
    const app: express.Express = express();

    app.use(contextServicesMiddleware(options.createContext, options.serviceContext));
    app.use(cookiesMiddleware());

    for (const applyBeforeware of modules.beforewares) {
        applyBeforeware(app);
    }

    // Don't rate limit heroku
    app.enable('trust proxy');

    if (middlewares !== null) {
        app.use(middlewares);
    }

    app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

    app.use(corsMiddleware);
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Credentials', JSON.stringify(true));
        res.header('Access-Control-Allow-Origin', req.headers.origin as string);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header(
            'Access-Control-Allow-Headers',
            'X-Requested-With, X-HTTP-Method-Override, X-CSP-Nonce, Content-Type, Accept',
        );
        next();
    });

    for (const applyMiddleware of modules.middlewares) {
        applyMiddleware(app);
    }

    if (__DEV__) {
        app.use(errorMiddleware);
    }

    return app;
}
