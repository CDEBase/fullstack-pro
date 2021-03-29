/// <reference path='../../../typings/index.d.ts' />
import env from '../../../servers/frontend-server/src/config/public-config';

const local_env = env;

const isBrowser = typeof window !== 'undefined';


export default local_env;

if (isBrowser) {
    // process.env = env;
    process.APP_ENV = local_env;
}

export const PUBLIC_SETTINGS: __PUBLIC_SETTINGS__ = {
    apolloLogging: false,
    GRAPHQL_URL: env.GRAPHQL_URL,
    LOCAL_GRAPHQL_URL: env.LOCAL_GRAPHQL_URL,
    LOG_LEVEL: env.LOG_LEVEL || 'trace',
};

