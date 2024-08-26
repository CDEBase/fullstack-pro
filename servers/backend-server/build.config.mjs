if (process.env.ENV_FILE !== null) {
    import('dotenv').then(({ config }) => config({ path: process.env.ENV_FILE }));
}

const __API_SERVER_PORT__ = process.env.GRAPHQL_URL ? new URL(process.env.GRAPHQL_URL).port : 8080;
const __SERVER_PROTOCOL__ = 'http';
const __LOCAL_SERVER_HOST__ = 'localhost';
const __GRAPHQL_ENDPOINT__ = process.env.GRAPHQL_URL ? new URL(process.env.GRAPHQL_URL).pathname : '/graphql';

const config = {
    __CLIENT__: false,
    __SERVER__: true,
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    'process.env.NODE_ENV': process.env.NODE_ENV || 'development',
    __GRAPHQL_URL__: process.env.GRAPHQL_URL || '/graphql',
    __CDN_URL__: process.env.CDN_URL || '',
    __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || '../frontend-server/dist/web',
    __API_SERVER_PORT__,
    __GRAPHQL_ENDPOINT__,
    __LOCAL_SERVER_HOST__,
    __API_URL__:
        process.env.API_URL ||
        `${__SERVER_PROTOCOL__}://${__LOCAL_SERVER_HOST__}:${__API_SERVER_PORT__}${__GRAPHQL_ENDPOINT__}`,
};

export default config;
