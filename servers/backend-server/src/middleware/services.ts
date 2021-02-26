import 'isomorphic-fetch';


export const contextServicesMiddleware = (createContext, serviceContext) =>  (req, res, next) => {
    Promise.all([
        createContext(req, res),
        serviceContext(req, res),
    ])
        .then(([ context, services ]) => {
            req.context = context;
            req.services = services;

            next();
        })
        .catch((err) => next());
};
