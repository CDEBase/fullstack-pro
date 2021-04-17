const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const webpackOpts = {
    mode: 'development',
    entry: './src/index.tsx',
    target: 'node',
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    node: {
        __dirname: false,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.graphql', '.gql'],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                test: /\.tsx?$/,
                ts: {
                    compiler: 'typescript',
                    configFile: 'tsconfig.json',
                },
                tslint: {
                    emitErrors: true,
                    failOnHint: true,
                },
            },
        }),
    ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: 'ts-loader',
            },
            {
                test: /\.graphql?/,
                exclude: /node_modules/,
                use: 'raw-loader',
            },
            {
                test: /\.(gql)$/,
                exclude: /node_modules/,
                use: ['graphql-tag/loader'],
            },
        ],
    },
    externals: [nodeExternals({ modulesDir: '../../../node_modules' }), nodeExternals()],
};

module.exports = webpackOpts;
