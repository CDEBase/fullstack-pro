
import * as express from 'express';
const cookiesMiddleware = require('universal-cookie-express');
import modules from './modules';
import { errorMiddleware } from './middleware/error';



export function expressApp(options, middlewares) {
    const app: express.Express = express();

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

    if (__DEV__) {
        app.use(errorMiddleware);
    }

    return app;
}

