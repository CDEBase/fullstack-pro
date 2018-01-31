/// <reference path='../../../../typings/index.d.ts' />

/**
 * This file opens up in public site, so make sure it is 
 * not dependent on any other file that compromises the security.
 */
const publicEnv = [
    'GRAPHQL_URL',
    'FACEBOOK_APP_ID',
    'GA_ID',
  ];

const isBrowser = typeof window !== 'undefined';
const base = (isBrowser ? window.__ENV__ : process.env) || {};

const env: any = {}
for (const v of publicEnv) {
    env[v] = base[v];
}
export default env;

export const PUBLIC_SETTINGS: __PUBLIC_SETTINGS__ = {
    apolloLogging: false,
    GRAPHQL_URL: process.env.GRAPHQL_URL || env.GRAPHQL_URL || __GRAPHQL_URL__,
    LOCAL_GRAPHQL_URL: process.env.LOCAL_GRAPHQL_URL || __GRAPHQL_URL__,
};