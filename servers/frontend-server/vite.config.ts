import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv-esm';
import envOnly from 'vite-env-only';
import { installGlobals } from '@remix-run/node';
import { defineRoutesConfig } from './tools/json-wrappers';
import buildConfig from './build.config.mjs';

// This installs globals such as "fetch", "Response", "Request" and "Headers".
installGlobals();

const directoryName = dirname(fileURLToPath(import.meta.url));
const packages: string[] = ['@sample-stack/counter-module-browser'];

export default defineConfig(({ isSsrBuild }) => {
    console.log('---IS SSR BUILD', isSsrBuild);

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
                    __SERVER__: true,
                    __CLIENT__: false,
                })),
            ),
        },
        plugins: [
            remix({
                appDirectory: 'src',
                routes: async (defineRoutes) =>
                    defineRoutes((routeFn) => {
                        defineRoutesConfig(routeFn, {
                            routesFileName: 'routes.json',
                            packages: packages,
                            rootPath: resolve(directoryName, '../..'),
                        });
                    }),
            }),
            tsconfigPaths({ ignoreConfigErrors: true }),
            envOnly(),
        ],
    };
});
