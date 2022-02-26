import { num, str, cleanEnv } from 'envalid';

export const config = cleanEnv(process.env, {
    APP_NAME1: str(),
});
