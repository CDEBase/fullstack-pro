import { config as dotenvConfig } from 'dotenv';

let dotEnvResult;
if (process.env.ENV_FILE !== null) {
    dotEnvResult = dotenvConfig({ path: process.env.ENV_FILE });
}

import buildConfig from '../../buildconfig.mjs';

const config = {
    ...buildConfig,
    __ENV__: dotEnvResult ? dotEnvResult.parsed : null,
    __CLIENT__: typeof window !== 'undefined',
    __SERVER__: typeof window === 'undefined',
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    __CDN_URL__: process.env.CDN_URL || '',
    __GRAPHQL_URL__: process.env.GRAPHQL_URL || '/graphql',
    __API_URL__: process.env.API_URL || '/graphql',
    __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || './dist/web',
};

console.log('---CONFIG', config);
export default config;
