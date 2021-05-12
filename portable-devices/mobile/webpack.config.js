const path = require('path');
const { createWebpackConfigAsync } = require('./expo-webpack');

// console.log('---EEEE', createWebpackConfigAsync);
module.exports = async function (env, argv) {
    const config = await createWebpackConfigAsync(env, argv);

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

    return config;
};
