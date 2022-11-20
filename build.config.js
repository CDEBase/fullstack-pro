process.env.ENV_FILE !== null &&
	require('dotenv').config({ path: process.env.ENV_FILE });

const __API_SERVER_PORT__ = process.env.GRAPHQL_URL
	? new URL(process.env.GRAPHQL_URL).port
	: process.env.GRAPHQL_URL || 8080;
const __WEB_SERVER_PORT__ = process.env.GRAPHQL_URL
	? new URL(process.env.GRAPHQL_URL).port
	: process.env.GRAPHQL_URL || 8080;
const __WEB_DEV_SERVER_PORT__ = process.env.SSR
	? 3010
	: process.env.CLIENT_URL
	? new URL(process.env.CLIENT_URL).port
	: 3000;
const __SERVER_PROTOCOL__ = 'http';
const __SERVER_HOST__ = 'localhost';
const __GRAPHQL_ENDPOINT__ = '/graphql';
const config = {
	__SERVER__: false,
	__CLIENT__: true,
	__SSR__: process.env.NODE_ENV === 'production', // enableing SSR only in Production as in Dev we have a issue
	__DEBUGGING__: false,
	__TEST__: false,
	__WEB_DEV_SERVER_PORT__,
	__GRAPHQL_ENDPOINT__,
	__SERVER_HOST__,
	__API_SERVER_PORT__,
	__API_URL__:
		process.env.API_URL ||
		`${__SERVER_PROTOCOL__}://${__SERVER_HOST__}:${__API_SERVER_PORT__}${__GRAPHQL_ENDPOINT__}`,
	__WEBSITE_URL__:
		process.env.WEBSITE_URL ||
		`${__SERVER_PROTOCOL__}://${__SERVER_HOST__}:${__WEB_DEV_SERVER_PORT__}`,
	__BACKEND_URL__:
		process.env.BACKEND_URL ||
		`${__SERVER_PROTOCOL__}://${__SERVER_HOST__}:${__WEB_SERVER_PORT__}`,
};

module.exports = config;
