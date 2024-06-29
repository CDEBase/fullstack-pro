import { str, cleanEnv } from 'envalid';
import { getEnvironment } from '@common-stack/core';

const env = getEnvironment();

export const config = cleanEnv(env, {
    GA_ID: str({ devDefault: 'G-xxxxxxx' }),
    GRAPHQL_URL: str({ devDefault: __GRAPHQL_URL__ }),
    LOCAL_GRAPHQL_URL: str({ default: __GRAPHQL_URL__ }),
    GRAPHQL_SUBSCRIPTION_URL: str({ default: env?.GRAPHQL_URL?.replace(/^http/, 'ws') }),
    LOG_LEVEL: str({ devDefault: 'debug' }),
});
