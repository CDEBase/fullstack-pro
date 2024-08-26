/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/// <reference path='../../../../typings/index.d.ts' />
import { logger } from '@cdm-logger/client';
import { lowerCase } from 'lodash-es';
/**
 * This file opens up in public site, so make sure it is
 * not dependent on any other file that compromises the security.
 * hello
 */
const publicEnv = [
    'NODE_ENV',
    'APP_URL',
    'GA_ID',
    'GRAPHQL_URL',
    'LOG_LEVEL',
    'AUTH0_CLIENT_ID',
    'AUTH0_DOMAIN',
    'AUTH0_CUSTOM_DOMAIN',
    'CLIENT_URL',
    'APP_NAME',
    'AUTH0_API_AUDIENCE',
    'AUTH0_REALM',
    'PAYPAL_ENVIRONMENT',
    'STRIPE_PUBLISHABLE_KEY',
    'AUTH0_TOKEN_GRANTED_TIME',
    'AUTH0_CUSTOM_CLAIMS_NAMESPACE',
    'INITIAL_ACCOUNT_PAGE',
    'SOCIAL_LOGIN_PROVIDERS',
    'CALLBACK_REDIRECT_URL',
    'POPUP_REDIRECT_URL',
    'LAYOUT_SETTINGS',
    'DEFAULT_EXTENDED_RENEWAL_TIME',
    'DISABLE_EMAIL_VERIFICATION',
    'WEB_APP_URL',
    'LOGOUT_REDIRECT_PATH',
    'LOGIN_REDIRECT_PATH',
    'REDIRECT_ON_LOGIN_VISIT',
    'ENABLE_COOKIE_BASED_AUTH',
    'APP_DOMAIN',
    'AUTH_ID_TOKEN_COOKIE_MAX_AGE',
];

const isBrowser = typeof window !== 'undefined';

const base = (isBrowser ? window.__ENV__ || (typeof __ENV__ !== 'undefined' && __ENV__) : process.env) || {};
const env: any = {};
for (const v of publicEnv) {
    env[v] = base[v];
}

// add subscription url for temporary
export default env;

if (isBrowser) {
    // process[lowerCase('env')] = env; // to avoid webpack to replace `process` with actual value.
    // process.APP_ENV = env;
    const process: any = {};
    process[lowerCase('env')] = env; // to avoid webpack to replace `process` with actual value.
    process.APP_ENV = env;
    window.process = process;
    // @ts-ignore
    window.__CLIENT__ = true;
    // @ts-ignore
    window.__SERVER__ = false;
} else {
    // @ts-ignore
    global.__CLIENT__ = false;
    // @ts-ignore
    global.__SERVER__ = true;
    // @ts-ignore
    __CLIENT__ = false;
    // @ts-ignore
    __SERVER__ = true;
}
try {
    // global.process = process;
    logger.info('Process Update Success!');
} catch (e) {
    logger.warn(e);
    logger.info(
        'Encountered above issue while running "global.process = process", will automatically try again in next render',
    );
}
