import { NODE_ENV, GRAPHQL_URL, FACEBOOK_APP_ID, GA_ID, LOG_LEVEL } from '@env';

const publicEnv = {
    NODE_ENV,
    GRAPHQL_URL,
    FACEBOOK_APP_ID,
    GA_ID,
    LOG_LEVEL,
    LOCAL_GRAPHQL_URL: GRAPHQL_URL,
};

const isBrowser = typeof window !== 'undefined';

export default publicEnv;

if (isBrowser) {
    // process.env = env;
    process.APP_ENV = publicEnv;
}

export const PUBLIC_SETTINGS: __PUBLIC_SETTINGS__ = {
    GRAPHQL_URL: publicEnv.GRAPHQL_URL,
    LOCAL_GRAPHQL_URL: publicEnv.LOCAL_GRAPHQL_URL,
    LOG_LEVEL: publicEnv.LOG_LEVEL || 'trace',
};
