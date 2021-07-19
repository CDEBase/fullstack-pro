const config = {
    __DEV__: process.env.NODE_ENV === 'development',
    __SERVER__: false,
    __CLIENT__: true,
    __SSR__: false,
    __DEBUGGING__: false,
    __TEST__: false,
    __GRAPHQL_URL__: process.env.API_URL || 'http://localhost:8080/graphql',
    __BACKEND_URL__: process.env.WEBSITE_URL || 'http://localhost:8080',
};

module.exports = config;
