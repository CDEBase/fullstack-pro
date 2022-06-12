const config = {
    ...require('../../build.config'),
    __CLIENT__: true,
    __SERVER__: false,
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    __CDN_URL__: process.env.CDN_URL || '',
    // 'process.env': {
    //     NODE_ENV: `"${process.env.NODE_ENV || 'development'}"`,
    //     STRIPE_PUBLIC_KEY: `"${process.env.STRIPE_PUBLIC_KEY}"`,
    // },
    __GRAPHQL_URL__: process.env.GRAPHQL_URL || '/graphql',
    __API_URL__: process.env.API_URL || '/graphql',
    __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || './dist/web',
};

module.exports = config;
