import 'isomorphic-fetch';
// import modules, { serviceContext } from '../modules';

let debug: boolean = false;
if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'trace' || process.env.LOG_LEVEL === 'debug') {
    debug = true;
}

export const contextServicesMiddleware = (req, res, next) => {
    Promise.all([
        // modules.createContext(req, res),
        // serviceContext(req, res),
    ])
        .then(([ context, services ]) => {
            req.context = context;
            req.services = services;

            next();
        })
        .catch((err) => next());
};
