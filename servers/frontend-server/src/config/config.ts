import * as envalid from 'envalid';


const { str, bool, num } = envalid;

export const config = envalid.cleanEnv(process.env, {
    NODE_ENV: str({ default: 'production', choices: ['production', 'staging', 'development', 'test'] }),
    BACKEND_URL: str({ devDefault: __BACKEND_URL__ }),
    LOCAL_BACKEND_URL: str({ devDefault: __BACKEND_URL__ }),
    LOCAL_GRAPHQL_URL: str({ default: __GRAPHQL_URL__ }),
    GRAPHQL_URL: str({ devDefault: __GRAPHQL_URL__ }),
    CLIENT_URL: str({ devDefault: __BACKEND_URL__ }),
    CONNECTION_ID: str({ devDefault: 'CONNECTION_ID' }),
    NAMESPACE: str({ default: 'default' }),
});
