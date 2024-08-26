import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import { dirname, resolve } from 'path';
import { installGlobals } from '@remix-run/node';
import { fileURLToPath } from 'url';
import { defineRoutesConfig } from '@common-stack/rollup-vite-utils/lib/vite-wrappers/json-wrappers.js';
import tsconfigPaths from 'vite-tsconfig-paths';
import { i18nInternationalizationPlugin } from '@common-stack/rollup-vite-utils/lib/vite-plugins/i18n-internationalization-plugin.js';
import { performCopyOperations } from '@common-stack/rollup-vite-utils/lib/preStartup/configLoader/configLoader.js';
import { loadEnvConfig } from '@common-stack/rollup-vite-utils/lib/preStartup/configLoader/envLoader.js';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import { mergeWith } from 'lodash-es';
import config from './app/cde-webconfig.json' assert { type: 'json' };

// This installs globals such as "fetch", "Response", "Request" and "Headers".
installGlobals();
const directoryName = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ isSsrBuild }) => {
    console.log('---IS SSR BUILD', isSsrBuild);

    const dotEnvResult = loadEnvConfig(directoryName);

    const viteConfig = {
        define: {
            __ENV__: JSON.stringify(dotEnvResult?.parsed),
            ...Object.assign(
                ...Object.entries(config.buildConfig).map(([k, v]) => ({
                    [k]: typeof v !== 'string' ? v : `"${v.replace(/\\/g, '\\\\')}"`,
                    __SERVER__: true,
                    __CLIENT__: false,
                })),
            ),
        },
        plugins: [
            i18nInternationalizationPlugin({
                folderName: 'cdm-locales',
                packages: [...config.modules, ...config.i18n.packages],
                namespaceResolution: 'basename',
            }),
            cjsInterop({
                dependencies: ['@apollo/client'],
            }),
            remix({
                appDirectory: 'src',
                routes: async (defineRoutes) => {
                    if (process.env.NODE_ENV === 'production') {
                        await performCopyOperations(config);
                    }
                    const metaJson = await import('./app/sync-meta.json').catch(() => null);
                    return defineRoutes((routeFn) => {
                        defineRoutesConfig(
                            routeFn,
                            {
                                routesFileName: 'routes.json',
                                packages: config.modules,
                                paths: config.paths,
                                rootPath: resolve(directoryName, '../..'),
                            },
                            metaJson,
                        );
                    });
                },
            }),
            tsconfigPaths({ ignoreConfigErrors: true }),
        ],
        resolve: {
            alias: {
                '@app': resolve(__dirname, 'app'),
                '@src': resolve(__dirname, 'src'),
            },
        },
    };

    // Deep merge custom Vite config from config.json
    return mergeWith(viteConfig, config.viteConfig);
});
