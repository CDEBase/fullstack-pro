/* eslint-disable import/no-extraneous-dependencies */
const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv-safe');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const utils = require('./tools/utils');
const buildConfig = require('./build.config');

const config = {
    target: 'electron-renderer',
    entry: {
        renderer: ['./src/renderer/main.tsx'],
        tray: ['./src/renderer/tray-main.tsx'],
        about: ['./src/renderer/about.tsx'],
    },
    output: {
        filename: '[name].js',
    },
    plugins: [
        new Dotenv({
            path: process.env.ENV_FILE,
        }),
        new webpack.DefinePlugin(
            Object.assign(
                ...Object.entries(buildConfig).map(([k, v]) => ({
                    [k]: typeof v !== 'string' ? v : `'${v.replace(/\\/g, '\\\\')}'`,
                })),
            ),
        ),
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
    resolve: {
        symlinks: true,
    },
    externals: [
        '@apollo/client',
        'react',
        'react-redux',
        'react-fela',
        'react-helmet',
        'react-loadable',
        'react-resizable',
        'react-router',
        'react-router-config',
        'react-router-dom',
        'react-router-redux',
        'react-transition-group',
        'connected-react-router',
        'history',
        '@apollo/react-common'
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

const workspaceRoot = path.resolve(__dirname, '../..');
const dirsToWatch = utils.getWorkspacePackagePaths(workspaceRoot);
// inorder to make watch to work on workspace packages
module.exports = function (givenConfig) {
    const updatedConfig = merge(givenConfig, config, {
        devServer: {
            ...givenConfig.devServer,
            contentBase: dirsToWatch,
            watchContentBase: true,
        },
    });
    return updatedConfig;
};
