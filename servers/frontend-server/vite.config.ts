import { vitePlugin as remix } from '@remix-run/dev';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
// import routesGeneratorPlugin from '@common-stack/vite-routes-plugin';
import dotenv from 'dotenv';
import buildConfig from './build.config.mjs';
import { loadRoutesConfig, defineRoutesConfig } from './json-wrapper';
// import { generateRemixRoutes } from './src/routes';

const directoryName = dirname(fileURLToPath(import.meta.url));
// loadRoutesConfig({
//     routesFileName: 'routes.json',
//     packages: ['@sample-stack/counter-module-browser'],
//     rootPath: resolve(directoryName, '../..'),
// });
console.log('--_VIET BASE ', process.cwd());

export default defineConfig(({ isSsrBuild }) => {
    console.log('---IS SSR BUILD', isSsrBuild, process.env);

    let dotEnvResult;
    if (process.env.NODE_ENV !== 'production') {
        dotEnvResult = dotenv.config({ path: resolve(__dirname, process.env.ENV_FILE) });
        if (dotEnvResult.error) {
            throw dotEnvResult.error;
        }
    }
    return {
        define: {
            __ENV__: JSON.stringify(dotEnvResult?.parsed),
            ...Object.assign(
                ...Object.entries(buildConfig).map(([k, v]) => ({
                    [k]: typeof v !== 'string' ? v : `"${v.replace(/\\/g, '\\\\')}"`,
                    // __SSR__: process.env.SSR === 'true',
                    // __CLIENT__: !isSsrBuild,
                })),
            ),
        },
        plugins: [
            // routesGeneratorPlugin({
            //     routesFileName: 'compute.json',
            //     packages: ['@common-stack/counter-module-browser'],
            // }),
            remix({
                appDirectory: 'src',
                routes: async (defineRoutes) =>
                    defineRoutes((routeFn) => {
                        defineRoutesConfig(routeFn, {
                            routesFileName: 'routes.json',
                            packages: ['@sample-stack/counter-module-browser'],
                            rootPath: resolve(directoryName, '../..'),
                        });
                    }),
            }),
            tsconfigPaths({ ignoreConfigErrors: true }),
        ],
    };
});
