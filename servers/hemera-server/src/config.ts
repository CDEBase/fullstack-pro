import * as envalid from 'envalid';


const { str } = envalid;

export const config = envalid.cleanEnv(process.env, {
    MONGO_URL: str(),
    NATS_URL: str(),
    NATS_USER: str(),
    NATS_PW: str(),
    CONNECTION_ID: str({devDefault: 'CONNECTION_ID'}),
    NAMESPACE: str({default: 'default'}),
});

