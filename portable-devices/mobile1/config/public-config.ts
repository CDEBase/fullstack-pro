import {
    NODE_ENV,
    GRAPHQL_URL,
    FACEBOOK_APP_ID,
    GA_ID,
    LOG_LEVEL,
} from '@env';

console.log("---LOGLEVE", LOG_LEVEL);
const env = {
    NODE_ENV,
    GRAPHQL_URL,
    FACEBOOK_APP_ID,
    GA_ID,
    LOG_LEVEL,
    LOCAL_GRAPHQL_URL: GRAPHQL_URL,
}

const isBrowser = typeof window !== 'undefined';


export default env;

if (isBrowser) {
    // process.env = env;
    process.APP_ENV = env;
}

export const PUBLIC_SETTINGS: __PUBLIC_SETTINGS__ = {
    apolloLogging: false,
    GRAPHQL_URL: env.GRAPHQL_URL,
    LOCAL_GRAPHQL_URL: env.LOCAL_GRAPHQL_URL,
    LOG_LEVEL: env.LOG_LEVEL || 'trace',
};

