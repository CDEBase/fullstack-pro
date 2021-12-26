const webpack = require('webpack');
const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

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
    );
    config.plugins.push(
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __DEBUGGING__: false,
        }),
    );
    return config;
};
