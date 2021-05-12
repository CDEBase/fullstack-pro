/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const Dotenv = require('dotenv-webpack');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const dotenv = require('dotenv-safe');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const configureYarnWorkspaces = require('./tools/configure');
// const dirsToWatch = glob.sync(`../*/lib`).map(dir => path.resolve(__dirname, dir));

const options = {
    stack: ['apollo', 'ts', 'react', 'webpack', 'css'],
    cache: '../../.cache',
    backendBuildDir: 'dist',
    frontendBuildDir: 'dist',
    dllBuildDir: 'dist/.build/dll',
    ssr: false,
    backendUrl: 'http://localhost:8091',
    webpackDll: true,
    reactHotLoader: true,
    useDefaultPostCss: true,
    persistGraphQL: false,
    frontendRefreshOnBackendChange: true,
    nodeDebugger: false,
    overridesConfig: './tools/webpackAppConfig.js',
    plugins: [
        new Dotenv({
            path: process.env.ENV_FILE,
        }),
        new webpack.DefinePlugin(),
        // Object.assign(
        //     ...Object.entries(buildConfig).map(([k, v]) => ({
        //         [k]: typeof v !== 'string' ? v : `'${v.replace(/\\/g, '\\\\')}'`
        //     }))
        // )
    ],
    defines: {
        __DEV__: process.env.NODE_ENV === 'development',
        __GRAPHQL_URL__: '"http://localhost:8091/graphql"',
    },
};
const config = {
    target: 'electron-renderer',
    entry: {
        renderer: ['./src/renderer/main.tsx'],
        tray: ['./src/renderer/tray.tsx'],
        about: ['./src/renderer/about.tsx'],
    },
    output: {
        filename: '[name].js',
    },
    plugins: [
        new Dotenv({
            path: process.env.ENV_FILE,
        }),
        new webpack.DefinePlugin({
            __DEV__: process.env.NODE_ENV === 'development',
            __GRAPHQL_URL__: '"http://localhost:8091/graphql"',
            __CLIENT__: true,
            __SSR__: false,
            __PERSIST_GQL__: false,
            __FRONTEND_BUILD_DIR__: `'${options.frontendBuildDir}'`,
            __DLL_BUILD_DIR__: `'${options.dllBuildDir}'`,
            __DEBUGGING__: false,
        }),
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(dotenv.parsed),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'assets/html/tray-page.html',
                    to: 'tray-page.html',
                },
                {
                    from: 'assets/html/about-page.html',
                    to: 'about-page.html',
                },
                {
                    from: 'assets/html/main-page.html',
                    to: 'main-page.html',
                },
            ],
        }),
    ],
    externals: [
        'react',
        'react-redux',
        'react-redux',
        'react-apollo',
        'react-fela',
        'react-helmet',
        'react-loadable',
        'react-redux',
        'react-resizable',
        'react-router',
        'react-router-config',
        'react-router-dom',
        'react-router-redux',
        'react-transition-group',
    ],
};

if (process.env.NODE_ENV === 'development') {
    const dotEnvPlugin = {
        plugins: [
            new Dotenv({
                path: process.env.ENV_FILE,
            }),
        ],
    };
    // config.builders.web.webpackConfig = merge(config.builders.web.webpackConfig, dotEnvPlugin);
}
const extraDefines = {
    __SSR__: false,
    __PERSIST_GQL__: false,
    __FRONTEND_BUILD_DIR__: `'${options.frontendBuildDir}'`,
    __DLL_BUILD_DIR__: `'${options.dllBuildDir}'`,
    __DEBUGGING__: false,
};

// Work in progress. Need to be fixed this first https://github.com/DavideDaniel/oss-projects/issues/39
// const workspaceRoot = path.resolve(__dirname, '../..');
// module.exports = function (givenConfig) {
//     console.log('--Merge', merge);
//     const updatedConfig = merge(givenConfig, config);
//     const finalConfig = configureYarnWorkspaces(updatedConfig, workspaceRoot);
//     return finalConfig;
// };

module.exports = config;
