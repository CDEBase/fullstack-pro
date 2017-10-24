/// <reference path='../../../../typings/index.d.ts' />

export const PUBLIC_SETTINGS: __PUBLIC_SETTINGS__ = {
    apolloLogging: false,
    GRAPHQL_URL: process.env.GRAPHQL_URL || __GRAPHQL_URL__,
};
