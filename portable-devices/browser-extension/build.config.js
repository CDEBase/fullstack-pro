/* eslint-disable jsonc/indent */
const config = {
    __SSR__: true,
    __GRAPHQL_URL__: 'http://localhost:8080/graphql',
    __PERSIST_GQL__: false,
    __DEBUGGING__: false,
    __CLIENT__: true,
    __SERVER__: false,
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    __API_URL__: process.env.API_URL || '/graphql',
    __BACKEND_URL__: 'http://localhost:8080',
};

module.exports = config;
