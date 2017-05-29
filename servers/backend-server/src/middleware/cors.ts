import * as cors from 'cors';
import * as express from 'express';
const { settings } = require('../../../../package.json');


const port = process.env.PORT || settings.webpackDevPort;
const appUrl = `http://localhost:${port}`;

const corsWhitelist = [
  appUrl,
];

const corsOptions = {
    origin: (origin, callback) => {
        const originIsWhitelisted = corsWhitelist.includes(origin);
        callback(null, originIsWhitelisted);
    },
    credentails: false,
};

export const corsMiddleware = cors(corsOptions);