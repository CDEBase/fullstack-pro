const path = require('path');
var nodeExternals = require('webpack-node-externals');
const debug = process.env.DEBUGGING || false;
const merge = require('webpack-merge');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const config = {
    builders: {
        web: {
            entry: './src/index.tsx',
            output: {
                chunkFilename: '[name].bundle.js',
            },
            stack: ['web', 'react'],
            tsLoaderOptions: {
                configFileName: "./tsconfig.json"
            },
            webpackDevPort: 3000,
            openBrowser: true,
            defines: {
                __CLIENT__: true,
            },
            test: {
                role: ['build', 'watch']
            },
            htmlTemplate: "../../tools/html-plugin-template.ejs",
            // Wait for backend to start prior to letting webpack load frontend page
            waitOn: ['tcp:localhost:8080'],
            enabled: true,
            webpackConfig: {
                plugins: [
                    new LodashModuleReplacementPlugin
                ],
                // for additional webpack configuration.
                resolve: process.env.NODE_ENV !== 'production'
                    ? {
                        alias: {
                            'react-dom': '@hot-loader/react-dom'
                        }
                    }
                    : {},
            }
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
                output: {
                    filename: 'main.js',
                },
                plugins: [
                    new CopyWebpackPlugin([{
                        from: '../../tools/esm-wrapper.js',
                        to: 'index.js',
                    }]),
                    new LodashModuleReplacementPlugin
                ],
                externals: [
                    nodeExternals(),
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
        useDefaultPostCss: true,
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
            __DEV__: process.env.NODE_ENV === 'development',
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
    config.options.defines.__BACKEND_URL__ = '"http://localhost:3010"';
    config.options.ssr = true;
    config.options.backendUrl = "http://localhost:3010";
}

if (process.env.NODE_ENV === 'production') {
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

if (process.env.NODE_ENV !== 'production') {

    if (!config.options.ssr) {
        console.log('Warning! exposing env variables in UI, only run in development.');
        var dotenv = require('dotenv-safe')
            .config(
                {
                    allowEmptyValues: true,
                    path: process.env.ENV_FILE,
                    example: '../../config/development/dev.env',
                });
        const envConfig = {
            plugins: [
                new webpack.DefinePlugin({
                    "__ENV__": JSON.stringify(dotenv.parsed)
                }),
            ],
        }
        config.builders.web.webpackConfig = merge(config.builders.web.webpackConfig, envConfig);
    }
}

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;