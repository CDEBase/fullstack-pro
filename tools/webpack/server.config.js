process.env.ENV_FILE !== null && require('dotenv').config({ path: process.env.ENV_FILE });
const webpack = require('webpack');
const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding

const modulenameExtra = process.env.BUILD_MODULE_TO_INCLUDE ? `${process.env.BUILD_MODULE_TO_INCLUDE}|` : '';
let modulenameRegex;

try {
    modulenameRegex = new RegExp(
        `(${modulenameExtra}@test-stack*|ts-invariant|webpack/hot/poll)|(\\.(css|less|scss|png|ico|jpg|gif|xml|woff|woff2|otf|ttf|eot|svg)(\\?[0-9a-z]+)?$)`
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

const config = ({ buildConfig, indexFilePath, currentDir }) => ({
    entry: {
        index: (process.env.NODE_ENV !== 'production' ? ['webpack/hot/poll?200'] : []).concat([
            'raf/polyfill',
            indexFilePath,
        ]),
    },
    name: 'server',
    module: {
        rules: [
            { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
            {
                test: /\.(png|ico|jpg|gif|xml)$/,
                use: { loader: 'url-loader', options: { name: '[fullhash].[ext]', limit: 100000 } },
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: { loader: 'url-loader', options: { name: '[fullhash].[ext]', limit: 100000 } },
            },
            {
                test: /\.(otf|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: { loader: 'file-loader', options: { name: '[fullhash].[ext]' } },
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? { loader: MiniCSSExtractPlugin.loader }
                        : { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? { loader: MiniCSSExtractPlugin.loader }
                        : { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? { loader: MiniCSSExtractPlugin.loader }
                        : { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true }, sourceMap: true } },
                ],
            },
            { test: /\.graphqls/, use: { loader: 'raw-loader' } },
            { test: /\.(graphql|gql)$/, use: [{ loader: 'graphql-tag/loader' }] },
            {
                test: /\.(mjs|mts|[tj]sx?)$/,
                use: {
                    loader: 'babel-loader',
                    options: { babelrc: true, rootMode: 'upward-optional' },
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
        filename: '[name].js',
        path: path.join(currentDir, 'dist'),
        publicPath: '/',
        sourceMapFilename: '[name].[chunkhash][ext].map',
    },
    devtool: process.env.NODE_ENV === 'production' ? 'nosources-source-map' : 'cheap-module-source-map',
    mode: process.env.NODE_ENV || 'development',
    performance: { hints: false },
    plugins: (process.env.NODE_ENV !== 'production'
        ? [
              //  new Dotenv(),
              new webpack.HotModuleReplacementPlugin(),
              new NodemonPlugin({ script: './dist/index.js' }),
          ]
        : []
    ).concat([
        new MiniCSSExtractPlugin({
            chunkFilename: '[name].[id].[chunkhash].css',
            filename: `[name].[chunkhash].css`,
        }),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] }),
        new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: true }),
        new webpack.DefinePlugin(
            Object.assign(
                ...Object.entries(buildConfig).map(([k, v]) => ({
                    [k]: typeof v !== 'string' ? v : `"${v.replace(/\\/g, '\\\\')}"`,
                })),
            ),
        ),
    ]),
    target: 'node',
    externals: [
        nodeExternals(),
        nodeExternals({
            modulesDir: path.resolve(currentDir, '../../node_modules'),
            allowlist: [modulenameRegex],
        }),
    ],
    optimization: {
        concatenateModules: false,
        minimize: false,
    },
    node: { __dirname: true, __filename: true },
});

module.exports = config;
