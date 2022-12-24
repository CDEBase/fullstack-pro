/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/// <reference path='../../../../typings/index.d.ts' />
import { logger } from '@cdm-logger/client';
import { lowerCase } from 'lodash';

/**
 * This file opens up in public site, so make sure it is
 * not dependent on any other file that compromises the security.
 */
const publicEnv = [
    'NODE_ENV',
    'GRAPHQL_URL',
    'GRAPHQL_SUBSCRIPTION_URL',
    'FACEBOOK_APP_ID',
    'GA_ID',
    'LOG_LEVEL',
    'AUTH0_CLIENT_ID',
    'AUTH0_DOMAIN',
    'CLIENT_URL',
    'APP_NAME',
    'AUTH0_API_AUDIENCE',
    'AUTH0_REALM',
    'CALLBACK_REDIRECT_URL',
    'STRIPE_PUBLISHABLE_KEY',
    'CDE_WORKSPACE_DOMAIN',
    'CDE_WORKSPACE_URL_PRFIX',
    'AUTH0_TOKEN_GRANTED_TIME',
    'ZIPKIN_URL',
    'EXTENSION_SOCKET_URL',
];

const isBrowser = typeof window !== 'undefined';
// const base = (isBrowser ? window.__ENV__ || __ENV__ : process.env) || {};
const base = {
    AUTH0_CLIENT_ID: 'T9XM292l33Xb12RVPvRIfrb5hYTZsRme',
    AUTH0_CLIENT_SECRET: 'U1d-16BDcLtD5y0Y3HUyPH2eGbLvYNot0io5mfNfIiwKpBunvvkzzt8R0GMm91wm',
    AUTH0_DOMAIN: 'dev-cdebase.auth0.com',
    AUTH0_ISSUER: 'https://dev-cdebase.auth0.com/',
    AUTH0_API_AUDIENCE: 'https://dev-cdebase.auth0.com/api/v2/',
    STRIPE_ENDPOINT_SECRET: 'werwerw',
    CALLBACK_REDIRECT_URL: 'https://gcegjophlahgidepgdinmcimpaeibmkj.chromiumapp.org/callback/',
    CLIENT_URL: 'https://gcegjophlahgidepgdinmcimpaeibmkj.chromiumapp.org',
    CONNECTION_ID: 'default',
};

const env: any = {};
for (const v of publicEnv) {
    env[v] = base[v];
}

// add subscription url for temporary
env.GRAPHQL_URL = env.GRAPHQL_URL || __GRAPHQL_URL__;
env.GRAPHQL_SUBSCRIPTION_URL = env.GRAPHQL_SUBSCRIPTION_URL || env.GRAPHQL_URL.replace(/^http/, 'ws');
export default env;

if (isBrowser) {
    process[lowerCase('env')] = env; // to avoid webpack to replace `process` with actual value.
    process.APP_ENV = env;
}
try {
    global.process = process;
    logger.info('Process Update Success!');
} catch (e) {
    logger.warn(e);
    logger.info(
        'Encountered above issue while running "global.process = process", will automatically try again in next render',
    );
}
export const PUBLIC_SETTINGS: __PUBLIC_SETTINGS__ = {
    apolloLogging: false,
    GRAPHQL_URL: process.env.GRAPHQL_URL || env.GRAPHQL_URL || __GRAPHQL_URL__,
    GRAPHQL_SUBSCRIPTION_URL: env.GRAPHQL_SUBSCRIPTION_URL,
    LOCAL_GRAPHQL_URL: process.env.LOCAL_GRAPHQL_URL || __GRAPHQL_URL__,
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};
