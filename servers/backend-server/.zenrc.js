const url = require('url');
const path = require('path');
var nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    builders: {
        server: {
            entry: './src/index.ts',
            stack: ['server'],
            tsLoaderOptions: {
                "configFileName": "./tsconfig.json"
            },
            defines: {
                __SERVER__: true
            },
            enabled: true,
            webpackConfig: {
                output: {
                    filename: 'main.js',
                },
                plugins: [
                    new CopyWebpackPlugin([{
                        from: '../../tools/esm-wrapper.js',
                        to: 'index.js',
                    }]),
                ],
                externals: [
                    nodeExternals({}),
                    nodeExternals({ whitelist: [/webpack\/hot/i, /babel-polyfill/], modulesDir: "../../node_modules" })
                ],
            }
        },
        test: {
            stack: ['server'],
            roles: ['test'],
            defines: {
                __TEST__: true
            }
        }
    },
    options: {
        stack: [
            'apollo',
            'ts',
            'css',
            'webpack'
        ],
        cache: '../../.cache',
        ssr: false,
        backendBuildDir: "dist",
        frontendBuildDir: "dist",
        dllBuildDir: "dist/.build/dll",
        webpackDll: false,
        reactHotLoader: false,
        persistGraphQL: false,
        backendUrl: "http://{ip}:8080",
        frontendRefreshOnBackendChange: true,
        nodeDebugger: false,
        defines: {
            __DEV__: process.env.NODE_ENV !== 'production',
            __GRAPHQL_URL__: '"http://localhost:8080/graphql"',
        },

    }
};

config.options.devProxy = config.options.ssr;

if (process.env.NODE_ENV === 'test') {
}
if (process.env.NODE_ENV === 'production') {
    // Generating source maps for production will slowdown compilation for roughly 25%
    config.options.sourceMap = false;
}

const extraDefines = {
    __SSR__: config.options.ssr,
    __PERSIST_GQL__: config.options.persistGraphQL,
    __FRONTEND_BUILD_DIR__: `"../frontend-server/dist/web"`,
    __DLL_BUILD_DIR__: `"../frontend-server/dist/build/dll"`
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;
