
import * as express from 'express';
const cookiesMiddleware = require('universal-cookie-express');
import modules from './modules';
import { errorMiddleware } from './middleware/error';
import { contextServicesMiddleware } from './middleware/services';
import { IModuleService } from './interfaces';

export function expressApp(options: IModuleService, middlewares, http?) {
    const app: express.Express = express();

    app.use(contextServicesMiddleware(options.createContext, options.serviceContext));

    for (const applyBeforeware of modules.beforewares) {
        applyBeforeware(app);
    }

    app.use(cookiesMiddleware());

    // Don't rate limit heroku
    app.enable('trust proxy');

    if (middlewares !== null) {
        app.use(middlewares);
    }

    // app.use(corsMiddleware);
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Credentials', JSON.stringify(true));
        res.header('Access-Control-Allow-Origin', req.headers.origin as string);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    });

    const corsOptions = {
        origin: true,
        credentials: true,
    };

    for (const applyMiddleware of modules.middlewares) {
        applyMiddleware(app);
    }

    if (__DEV__) {
        app.use(errorMiddleware);
    }

    return app;
}
