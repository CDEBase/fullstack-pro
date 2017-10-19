import * as cors from 'cors';
import * as express from 'express';
import { options as settings } from '../../../../.spinrc.json';



const port = process.env.CLIENT_PORT || settings.webpackDevPort;
const appUrl = process.env.CLIENT_URL || `http://localhost:${port}`;

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
