import * as cors from 'cors';
import * as express from 'express';
import { SETTINGS } from '../../config';


const port =  SETTINGS.webpackDevPort;
const appUrl = `http://localhost:${port}`;

const corsWhitelist = [
  appUrl,
  SETTINGS.CLIENT_URL,
];

const corsOptions = {
    origin: (origin, callback) => {
        const originIsWhitelisted = corsWhitelist.includes(origin);
        callback(null, originIsWhitelisted);
    },
    credentails: false,
};

export const corsMiddleware = cors(corsOptions);
