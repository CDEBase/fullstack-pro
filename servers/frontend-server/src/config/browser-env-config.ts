import { str, cleanEnv } from 'envalid';

const env = (process as any).APP_ENV || process.env;

export const config = cleanEnv(env, {
    GA_ID: str({ devDefault: 'G-xxxxxxx' }),
});
