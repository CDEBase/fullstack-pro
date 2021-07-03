/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const config = {
    devtool: process.env.DEBUG_PROD === 'true' ? 'source-map' : 'none',
    target: 'electron-main',
    entry: './src/main/index.ts',
    mode: 'development',
    output: {
        filename: 'main-process.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.mjs', '.graphql', '.graphqls', '.gql', '.native.tsx', '.native.ts'],
    },
    optimization: {
        minimizer: process.env.E2E_BUILD
            ? []
            : [
                  new TerserPlugin({
                      parallel: true,
                      sourceMap: true,
                      cache: true,
                  }),
              ],
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'assets/preload.js',
                    to: 'preload.js',
                },
                {
                    from: 'tools/esm-wrapper.js',
                    to: 'main.js',
                },
            ],
        }),
        // new Dotenv({
        //     path: process.env.ENV_FILE,
        // }),
        new webpack.DefinePlugin({
            __DEV__: process.env.NODE_ENV === 'development',
            __GRAPHQL_URL__: '"http://localhost:8091/graphql"',
            __CLIENT__: false,
            __SSR__: false,
            __PERSIST_GQL__: false,
            __DEBUGGING__: false,
        }),
        // new webpack.DefinePlugin({
        //     __ENV__: JSON.stringify(dotenv.parsed),
        // }),
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
            openAnalyzer: process.env.OPEN_ANALYZER === 'true',
        }),

        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds.
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks.
         */
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG_PROD: false,
            START_MINIMIZED: false,
            E2E_BUILD: false,
        }),
    ],

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false,
    },
};

module.exports = config;
