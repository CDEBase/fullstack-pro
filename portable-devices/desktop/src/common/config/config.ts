/// <reference path='../../../../../typings/index.d.ts' />
import * as envalid from 'envalid';

const { str, bool, json, num } = envalid;

export const config = envalid.cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    ELECTRON_WEBPACK_WDS_PORT: num({ default: 3000 }),
    ELECTRON_WEBPACK_WDS_HOST: str({ default: 'localhost' }),
    // BACKEND_URL: str({ devDefault: __BACKEND_URL__ }),
    // GRAPHQL_URL: str({ devDefault: __GRAPHQL_URL__ }),
    CLIENT_URL: str({ default: 'http://localhost' }),
    NAMESPACE: str({ default: 'default' }),
    apolloLogging: bool({ default: false, devDefault: true }),
});
