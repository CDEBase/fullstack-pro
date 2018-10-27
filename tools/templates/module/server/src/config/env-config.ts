import * as envalid from 'envalid';
const { str, email, json, num } = envalid;

export interface IConfig {
    NODE_ENV: string;
    REDIS_URL?: string;
    PROMETHEUS_API_URL?: string;
}

export const config = envalid.cleanEnv<IConfig>(process.env, {
    REDIS_URL: str(),
    PROMETHEUS_API_URL: str(),
    NODE_ENV: str({choices: ['production', 'test', 'staging', 'development'], default: 'production'}),
});

