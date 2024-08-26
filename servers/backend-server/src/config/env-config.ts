/// <reference path='../../../../typings/index.d.ts' />
import { str, cleanEnv } from 'envalid';

export const config = cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    CONNECTION_ID: str({ devDefault: 'CONNECTION_ID' }),
    NAMESPACE: str({ default: 'default' }),
    ACTIVITY_NAMESPACE: str({ devDefault: 'default' }),
    API_NAMESPACE: str({ devDefault: 'default' }),
    ADMIN_API_NAMESPACE: str({ devDefault: 'default' }),
    BACKEND_URL: str({ devDefault: __BACKEND_URL__ }),
});
