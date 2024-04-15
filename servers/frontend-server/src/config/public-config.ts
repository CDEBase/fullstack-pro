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
 */
const publicEnv = [
    'NODE_ENV',
    'GRAPHQL_URL',
    'GA_ID',
    'LOG_LEVEL',
    'CLIENT_URL',
    'APP_DOMAIN',
    'APP_URL',
    'APP_NAME',
];

const isBrowser = typeof window !== 'undefined';

const base = (isBrowser ? window.__ENV__ || (typeof __ENV__ !== 'undefined' && __ENV__) : process.env) || {};
const env: any = {};
for (const v of publicEnv) {
    env[v] = base[v];
}

// add subscription url for temporary
env.GRAPHQL_URL = env.GRAPHQL_URL || __GRAPHQL_URL__;
env.GRAPHQL_SUBSCRIPTION_URL = env.GRAPHQL_SUBSCRIPTION_URL || env.GRAPHQL_URL.replace(/^http/, 'ws');
export default env;
if (isBrowser) {
    let process: any = {};
    process[lowerCase('env')] = env; // to avoid webpack to replace `process` with actual value.
    process.APP_ENV = env;
    window.process = process;
    window.__CLIENT__ = true;
    window.__SERVER__ = false;
} else {
    global.__CLIENT__ = false;
    global.__SERVER__ = true;
    __CLIENT__ = false;
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
