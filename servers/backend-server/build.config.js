process.env.ENV_FILE !== null && require('dotenv').config({ path: process.env.ENV_FILE });
const config = {
    ...require('../../build.config'),
    __CLIENT__: false,
    __SERVER__: true,
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    'process.env.NODE_ENV': process.env.NODE_ENV || 'development',
    __SERVER_PORT__: (new URL(process.env.SERVER_PORT || process.env.BACKEND_URL)).port,
    __GRAPHQL_URL__: process.env.GRAPHQL_URL || '/graphql',
    __WEBSITE_URL__: process.env.CLIENT_URL || 'http://localhost:3000',
    __CDN_URL__: process.env.CDN_URL || '',
    __BACKEND_URL__: process.env.BACKEND_URL || 'http://localhost:8080',
    __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || '../frontend-server/build',
};

module.exports = config;
