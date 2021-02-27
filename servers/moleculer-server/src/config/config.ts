import * as envalid from 'envalid';
process.env.ENV_FILE !== null && (require('dotenv')).config({ path: process.env.ENV_FILE });


const { str, bool, json } = envalid;

export const config = envalid.cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    NATS_URL: str(),
    NATS_USER: str(),
    NATS_PW: str(),
    MONGO_URL: str(),
    REDIS_CLUSTER_URL: json({devDefault: '[{"port":6379,"host":"localhost"}]',  example: '[{"port":6379,"host":"localhost"}]'}),
    REDIS_URL: str({ devDefault: 'localhost' }),
    REDIS_CLUSTER_ENABLED: bool({ devDefault: false }),
    REDIS_SENTINEL_ENABLED: bool({ devDefault: true }),
    CONNECTION_ID: str({devDefault: 'CONNECTION_ID'}),
    NAMESPACE: str({default: 'default'}),
    LOG_LEVEL: str({ default: 'info', choices: ['info', 'debug', 'trace'] }),
});

