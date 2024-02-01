/* eslint-disable jest/require-hook */
import cors from 'cors';
import { logger } from '@cdm-logger/server';
import { config } from '../../config';

const { CLIENT_URL, BACKEND_URL, LOCAL_GRAPHQL_URL } = config;

const corsWhitelist = [CLIENT_URL, BACKEND_URL, LOCAL_GRAPHQL_URL];
logger.info('corsWhitelist (%j)', corsWhitelist);

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (origin && corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // TODO: only throw when in debug mode
            logger.error('url (%s) is not in the whitelist', origin);
            // callback(new Error('Not allowed by CORS'))
            logger.warn('allowing all origins temporarily, you need to disable it.');
            callback(null, true);
        }
    },
    credentials: true,
};

export const corsMiddleware = cors(corsOptions);
