const webpack = require('webpack');
const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const EnvListPlugin = require('@common-stack/env-list-loader');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    config.module.rules.push(
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [path.join(__dirname, 'node_modules/react-router-native')],
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [path.join(__dirname, '../../node_modules/react-router-native')],
        },
        {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        },
        {
            // searches for files ends with <dir>/config/env-config.js or <dir>/config/public-config.js
            test: /config\/(env-config|public-config)\.(j|t)s/,
            use: {
                loader: '@common-stack/env-list-loader',
            },
        },
    );
    config.plugins.push(
        // The plugin lists the environment that required as well recommendation about the keys used.
        new EnvListPlugin.Plugin(),
    );
    config.plugins.push(
        new EnvListPlugin.Plugin(),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __DEBUGGING__: false,
        }),
    );
    return config;
};
