import * as envalid from 'envalid';
process.env.ENV_FILE !== null && (require('dotenv')).config({ path: process.env.ENV_FILE });


const { str } = envalid;

export const config = envalid.cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    NATS_URL: str(),
    NATS_USER: str(),
    NATS_PW: str(),
    CONNECTION_ID: str({devDefault: 'CONNECTION_ID'}),
    NAMESPACE: str({default: 'default'}),
    LOG_LEVEL: str({ default: 'info', choices: ['info', 'debug', 'trace'] }),
});

