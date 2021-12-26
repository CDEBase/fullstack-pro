
const __SERVER_PORT__ = 8080;
const __SERVER_PROTOCOL__ = 'http';
const __SERVER_HOST__ = 'localhost';
const __GRAPHQL_ENDPOINT__ = 'graphql';
const config = {
    __SERVER__: false,
    __CLIENT__: true,
    __SSR__: false,
    __DEBUGGING__: false,
    __TEST__: false,
    __API_URL__: process.env.API_URL || `${__SERVER_PROTOCOL__}://${__SERVER_HOST__}:${__SERVER_PORT__}/${__GRAPHQL_ENDPOINT__}`,
    __WEBSITE_URL__: process.env.WEBSITE_URL || `${__SERVER_PROTOCOL__}://${__SERVER_HOST__}:${__SERVER_PORT__}`,
};

module.exports = config;
