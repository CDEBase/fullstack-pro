const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding
const EnvListPlugin = require('@common-stack/env-list-loader');
const buildConfig = require('./build.config');

const modulenameExtra = process.env.BUILD_MODULE_TO_INCLUDE ? `${process.env.BUILD_MODULE_TO_INCLUDE}|` : '';
let modulenameRegex;

try {
    modulenameRegex = new RegExp(
        `(${modulenameExtra}ts-invariant|webpack/hot/poll)|(\\.(css|less|scss|png|ico|jpg|gif|xml|woff|woff2|otf|ttf|eot|svg)(\\?[0-9a-z]+)?$)`,
    );
    console.log('Module Name Regex: ', modulenameRegex);
} catch (error) {
    console.error('Error creating regex for module name: ', error);
}

if (process.env.BUILD_MODULE_TO_INCLUDE) {
    console.log('Build Module to include (BUILD_MODULE_TO_INCLUDE): ', process.env.BUILD_MODULE_TO_INCLUDE);
} else {
    console.log('BUILD_MODULE_TO_INCLUDE is not set.');
}

const config = {
    entry: {
        index: (process.env.NODE_ENV !== 'production' ? ['webpack/hot/poll?200'] : []).concat([
            // 'raf/polyfill',
            './src/index.ts',
        ]),
    },
    name: 'server',
    module: {
        rules: [
            {
                test: /\.(png|ico|jpg|gif|xml)$/,
                use: { loader: 'url-loader', options: { name: '[hash].[ext]', limit: 100000 } },
            },
            {
                test: /\.woff(2)?(\?[0-9a-z]+)?$/,
                use: { loader: 'url-loader', options: { name: '[hash].[ext]', limit: 100000 } },
            },
            {
                test: /\.(otf|ttf|eot|svg)(\?[0-9a-z]+)?$/,
                use: { loader: 'file-loader', options: { name: '[hash].[ext]' } },
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'isomorphic-style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'isomorphic-style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'isomorphic-style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'less-loader', options: { javascriptEnabled: true, sourceMap: true } },
                ],
            },
            { test: /\.graphqls/, use: { loader: 'raw-loader' } },
            { test: /\.(graphql|gql)$/, use: [{ loader: 'graphql-tag/loader' }] },
            // {
            //     test: /\.[tj]sx?$/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: { babelrc: true, rootMode: 'upward-optional' },
            //     },
            // },
            {
                test: /\.tsx?$/, // for TypeScript
                loader: 'esbuild-loader',
                options: {
                    loader: 'tsx', // Or 'ts' for TypeScript without JSX
                    target: 'es2015', // Specify ECMAScript target version
                },
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/, // for JavaScript
                loader: 'esbuild-loader',
                options: {
                    loader: 'jsx', // Or 'js' for plain JavaScript
                    target: 'es2015',
                },
                exclude: /node_modules/,
            },
            {
                // searches for files ends with <dir>/config/env-config.js or <dir>/config/public-config.js
                test: /config\/(env-config|public-config)\.(j|t)s/,
                use: {
                    loader: '@common-stack/env-list-loader',
                },
            },
            { test: /locales/, use: { loader: '@alienfast/i18next-loader' } },
        ],
        unsafeCache: false,
    },
    resolve: {
        symlinks: true,
        cacheWithContext: false,
        unsafeCache: false,
        extensions: [
            '.web.mjs',
            '.web.js',
            '.web.jsx',
            '.web.ts',
            '.web.tsx',
            '.mjs',
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
        ],
    },
    watchOptions: { ignored: /dist/ },
    output: {
        pathinfo: false,
        filename: 'index.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        sourceMapFilename: '[name].[chunkhash].js.map',
    },
    devtool: process.env.NODE_ENV === 'production' ? 'nosources-source-map' : 'cheap-module-source-map',
    mode: process.env.NODE_ENV || 'development',
    performance: { hints: false },
    plugins: (process.env.NODE_ENV !== 'production'
        ? [
              //   new Dotenv(),
              new webpack.HotModuleReplacementPlugin(),
              new NodemonPlugin({ script: './dist/index.js' }),
          ]
        : []
    ).concat([
        // The plugin lists the environment that required as well recommendation about the keys used.
        new EnvListPlugin.Plugin(),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] }),
        new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: true }),
        new webpack.DefinePlugin(
            Object.assign(
                ...Object.entries(buildConfig).map(([k, v]) => ({
                    [k]: typeof v !== 'string' ? v : `"${v.replace(/\\/g, '\\\\')}"`,
                })),
            ),
        ),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: '../../tools/esm-wrapper.js',
        //             to: 'index.js',
        //         },
        //     ],
        // }),
    ]),
    target: 'node',
    externals: [
        nodeExternals(),
        nodeExternals({
            modulesDir: path.resolve(__dirname, '../../node_modules'),
            allowlist: [modulenameRegex],
        }),
    ],
    optimization: {
        concatenateModules: false,
        minimize: false,
    },
    node: { __dirname: true, __filename: true },
};

module.exports = config;
