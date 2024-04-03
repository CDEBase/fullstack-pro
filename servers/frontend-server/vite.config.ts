import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';
import { jsxRoutes } from 'remix-json-routes';
import routes from './src/routes';
import dotenv from 'dotenv-esm';
import { defineRoutesConfig } from './json-wrapper';
import buildConfig from './build.config.mjs';


const directoryName = dirname(fileURLToPath(import.meta.url));
export default defineConfig((d) => {
    console.log('---IS SSR BUILD', d);

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
            remix({
                ssr: true,
                appDirectory: 'src',
                // routes: async (defineRoutes) => jsxRoutes(defineRoutes, routes)
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


// remix({
//     ssr: false,
//     appDirectory: 'src',
//     routes: async (defineRoutes) => jsxRoutes(defineRoutes, routes)
//     // defineRoutes((routeFn) => {
//     //     defineRoutesConfig(routeFn, {
//     //         routesFileName: 'routes.json',
//     //         packages: ['@sample-stack/counter-module-browser'],
//     //         rootPath: resolve(directoryName, '../..'),
//     //     });
//     // }),
// }),