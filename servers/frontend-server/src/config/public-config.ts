/// <reference path='../../../../typings/index.d.ts' />
import { logger } from '@cdm-logger/client';
import { lowerCase } from 'lodash-es';
import dotenv from 'dotenv';
/**
 * This file opens up in public site, so make sure it is
 * not dependent on any other file that compromises the security.
 */
const publicEnv = ['NODE_ENV', 'GRAPHQL_URL', 'FACEBOOK_APP_ID', 'LOCAL_GRAPHQL_URL', 'GA_ID', 'LOG_LEVEL'];

const isBrowser = typeof window !== 'undefined';

if (!isBrowser) {
    if (process.env.ENV_FILE !== null) {
        // dotenv.config({ path: process.env.ENV_FILE });
    }
}
const base = (isBrowser ? window.__ENV__ || (typeof __ENV__ !== 'undefined' && __ENV__) : process.env) || {};
const env: any = {};
for (const v of publicEnv) {
    env[v] = base[v];
}

export default env;

if (isBrowser) {
    // process[lowerCase('env')] = env; // to avoid webpack to replace `process` with actual value.
    // process.APP_ENV = env;
    let process: any = {};
    process[lowerCase('env')] = env; // to avoid webpack to replace `process` with actual value.
    process.APP_ENV = env;
    window.process = process;
    window.__CLIENT__ = true;
    window.__SERVER__ = false;
} else {
    global.__CLIENT__ = false;
    global.__SERVER__ = true;
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
