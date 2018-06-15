const url = require('url');
const path = require('path');
const Dotenv = require('dotenv-webpack');
var nodeExternals = require('webpack-node-externals');
const debug = process.env.DEBUGGING || false;

const config = {
    builders: {
        web: {
            entry: './src/index.tsx',
            stack: ['web'],
            tsLoaderOptions: {
                configFileName: "./tsconfig.json"
            },
            webpackDevPort: 3000,
            openBrowser: true,
            defines: {
                __CLIENT__: true,
            },
            htmlTemplate: "../../tools/html-plugin-template.ejs",
            // Wait for backend to start prior to letting webpack load frontend page
            waitOn: ['tcp:localhost:8080'],
            enabled: true
        },
        server: {
            entry: './src/backend/app.ts',
            stack: ['server'],
            tsLoaderOptions: {
                configFileName: "./tsconfig.json"
            },
            defines: {
                __SERVER__: true,
            },
            enabled: false,
            webpackConfig: {
                externals: [
                    nodeExternals({ whitelist: [/webpack\/hot/i, /babel-polyfill/] }),
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
            "apollo",
            "ts",
            "react",
            "webpack",
            "css"
        ],
        cache: '../../.cache',
        backendBuildDir: "dist",
        frontendBuildDir: "dist",
        dllBuildDir: "dist/.build/dll",
        ssr: false,
        backendUrl: "http://localhost:8080",
        webpackDll: true,
        reactHotLoader: true,
        persistGraphQL: false,
        frontendRefreshOnBackendChange: true,
        nodeDebugger: false,
        overridesConfig: "./tools/webpackAppConfig.js",
        plugins: [
            new Dotenv({
                path: process.env.ENV_FILE
            })
        ],
        defines: {
            __DEV__: process.env.NODE_ENV !== 'production',
            __GRAPHQL_URL__: '"http://localhost:8080/graphql"',
        }
    }
};
if (process.env.NODE_ENV === 'development') {
    config.builders.web.webpackConfig = {
        plugins: [
            new Dotenv({
                path: process.env.ENV_FILE
            })
        ],
    }
}
if (process.env.SSR) {
    config.builders.server.enabled = true;
    config.options.defines.__BACKEND_URL__ = '"http://localhost:3010"';
    config.options.ssr = true;
    config.options.backendUrl = "http://localhost:3010";
}
if (process.env.NODE_ENV !== 'development') {
    config.builders.server.enabled = true;
    config.options.ssr = true;
    config.options.backendUrl = "http://localhost:3010";
}
if (process.env.NODE_ENV === 'production') {
    config.options.defines.__BACKEND_URL__ = '"http://localhost:3010"';
    // Generating source maps for production will slowdown compilation for roughly 25%
    config.options.sourceMap = false;
}
config.options.devProxy = config.options.ssr;

const extraDefines = {
    __SSR__: config.options.ssr,
    __PERSIST_GQL__: `'${config.options.persistGraphQL}'`,
    __FRONTEND_BUILD_DIR__: `'${config.options.frontendBuildDir}'`,
    __DLL_BUILD_DIR__: `'${config.options.dllBuildDir}'`,
    __DEBUGGING__: `'${debug}'`
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;