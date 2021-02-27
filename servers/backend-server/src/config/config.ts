/// <reference path='../../../../typings/index.d.ts' />
import * as envalid from 'envalid';


const { str, bool, json } = envalid;

export const config = envalid.cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    NATS_URL: str(),
    NATS_USER: str(),
    NATS_PW: str(),
    MONGO_URL: str(),
    LOG_LEVEL: str({ default: 'info', choices: ['info', 'debug', 'trace'] }),
    REDIS_CLUSTER_URL: json({devDefault: '[{"port":6379,"host":"localhost"}]',  example: '[{"port":6379,"host":"localhost"}]'}),
    REDIS_URL: str({ devDefault: 'localhost' }),
    REDIS_CLUSTER_ENABLED: bool({ devDefault: false }),
    REDIS_SENTINEL_ENABLED: bool({ devDefault: true }),
    HEMERA_LOG_LEVEL: str({ default: 'info' }),
    BACKEND_URL: str({ devDefault: __BACKEND_URL__ }),
    GRAPHQL_URL: str({ devDefault: __GRAPHQL_URL__ }),
    CLIENT_URL: str({ devDefault: __BACKEND_URL__ }),
    CONNECTION_ID: str({ devDefault: 'CONNECTION_ID' }),
    NAMESPACE: str({ default: 'default' }),
    apolloLogging: bool({ default: false }),
});

