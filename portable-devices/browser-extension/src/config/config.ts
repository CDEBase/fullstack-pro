/* eslint-disable no-underscore-dangle */
import * as envalid from 'envalid';

const { str, bool, num } = envalid;

export const config = envalid.cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    BACKEND_URL: str({ default: 'http://localhost:8080' }),
    LOCAL_BACKEND_URL: str({ default: 'http://localhost:8080' }),
    LOCAL_GRAPHQL_URL: str({ default: 'http://localhost:8080/graphql' }),
    GRAPHQL_URL: str({ default: 'http://localhost:8080/graphql' }),
    CLIENT_URL: str({ default: 'http://localhost:8080' }),
    CONNECTION_ID: str({ default: 'CONNECTION_ID' }),
    NAMESPACE: str({ default: 'default' }),
    AUTH0_TOKEN_GRANTED_TIME: num({ default: 2592000000, desc: 'set to 30 days(30*24*60*60*1000) by default' }),
});
