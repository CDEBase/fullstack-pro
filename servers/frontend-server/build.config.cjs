const config = {
    ...require('../../build.config.cjs'),
    __CLIENT__: true,
    __SERVER__: false,
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    __CDN_URL__: process.env.CDN_URL || '',
    __GRAPHQL_URL__: process.env.GRAPHQL_URL || '/graphql',
    __API_URL__: process.env.API_URL || '/graphql',
    __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || './dist/web',
};

module.exports = config;
