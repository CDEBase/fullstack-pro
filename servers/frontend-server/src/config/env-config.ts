import * as envalid from 'envalid';

const { str, bool, json } = envalid;

export const config = envalid.cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    BACKEND_URL: str({ devDefault: __BACKEND_URL__ }),
    LOCAL_BACKEND_URL: str({ devDefault: __BACKEND_URL__ }),
    LOCAL_GRAPHQL_URL: str({ default: __GRAPHQL_URL__, desc: 'Graphql Server URL within LAN' }),
    GRAPHQL_URL: str({ devDefault: __GRAPHQL_URL__, desc: 'Graphql Server Public URL' }),
    LOG_LEVEL: str({ devDefault: 'trace' }),
    REDIS_CLUSTER_URL: json({
        devDefault: '[{"port":6379,"host":"localhost"}]',
        example: '[{"port":6379,"host":"localhost"}]',
    }),
    REDIS_URL: str({ devDefault: 'localhost' }),
    REDIS_CLUSTER_ENABLED: bool({ devDefault: false }),
    REDIS_SENTINEL_ENABLED: bool({ devDefault: true }),
    APP_NAME: str({ devDefault: 'FullStack' }),
    CLIENT_URL: str({ devDefault: __BACKEND_URL__ }),
    CONNECTION_ID: str({ devDefault: 'CONNECTION_ID' }),
    NAMESPACE: str({ default: 'default' }),
});
