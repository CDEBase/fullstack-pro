import { config as dotenvConfig } from 'dotenv';

if (process.env.ENV_FILE !== null) {
    dotenvConfig({ path: process.env.ENV_FILE });
}

import buildConfig from '../../build.config';

const config = {
    ...buildConfig,
    __CLIENT__: false,
    __SERVER__: true,
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: false,
    'process.env.NODE_ENV': process.env.NODE_ENV || 'development',
    __GRAPHQL_URL__: process.env.GRAPHQL_URL || '/graphql',
    __CDN_URL__: process.env.CDN_URL || '',
    __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || '../frontend-server/dist/web',
};

export default config;
