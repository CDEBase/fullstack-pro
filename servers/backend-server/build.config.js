process.env.ENV_FILE !== null && require('dotenv').config({ path: process.env.ENV_FILE });
const config = {
    ...require('../../build.config'),
    __CLIENT__: false,
    __SERVER__: true,
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    'process.env.NODE_ENV': process.env.NODE_ENV || 'development',
    __GRAPHQL_URL__: process.env.GRAPHQL_URL || '/graphql',
    __CDN_URL__: process.env.CDN_URL || '',
    __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || '../frontend-server/dist/web',
};

console.log('---CONFIG', config);
module.exports = config;
