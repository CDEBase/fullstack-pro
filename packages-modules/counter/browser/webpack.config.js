const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

const webpackOpts = {
    mode: 'development',
    entry: {
        index: './src/index.ts',
        'index.native': './src/index.native.ts',
    },
    target: 'node',
    output: {
        path: path.join(__dirname, 'lib'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.graphql', '.graphqls', '.gql', '.native.tsx', '.native.ts'],
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
                options: {
                    compilerOptions: {
                        outDir: path.join(),
                    },
                },
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
            {
                test: /\.(gql)$/,
                exclude: /node_modules/,
                use: ['graphql-tag/loader'],
            },
            {
                test: /\.graphql?/,
                exclude: /node_modules/,
                use: 'raw-loader',
            },
        ],
    },
    externals: [nodeExternals({ modulesDir: '../../../node_modules' }), nodeExternals()],
};

module.exports = webpackOpts;
