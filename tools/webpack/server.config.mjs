import webpack from 'webpack';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import Dotenv from 'dotenv-webpack';
import NodemonPlugin from 'nodemon-webpack-plugin'; // Ding

const modulenameExtra = process.env.MODULENAME_EXTRA ? `${process.env.MODULENAME_EXTRA}|` : '';
const modulenameRegex = new RegExp(
    `(${modulenameExtra}@pubngo-stack*|client|webpack/hot/poll)|(\\.(css|less|scss|png|ico|jpg|gif|xml|woff|woff2|otf|ttf|eot|svg)(\\?[0-9a-z]+)?$)`,
);

const config = ({ buildConfig, indexFilePath, currentDir }) => ({
    entry: {
        index: (process.env.NODE_ENV !== 'production' ? ['webpack/hot/poll?200'] : []).concat([
            // 'raf/polyfill',
            indexFilePath,
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
            {
                test: /\.[tj]sx?$/,
                use: {
                    // loader: 'babel-loader',
                    // options: { babelrc: true, rootMode: 'upward-optional' },
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'tsx',
                        target: 'es2021',
                    },
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
        // fallback: {
        //     // fs: false,
        //     // // path: import('path-browserify'),
        //     // path: false,
        //     http: false,
        //     buffer: path.resolve(currentDir, 'node_modules/buffer'),
        //     fs: false,
        //     path: path.resolve(currentDir, 'node_modules/path-browserify'),
        //     stream: path.resolve(currentDir, 'node_modules/stream-browserify'),
        // },
    },
    watchOptions: { ignored: /dist/ },
    output: {
        pathinfo: false,
        filename: 'index.js',
        path: path.join(currentDir, 'dist'),
        library: {
            type: 'module',
        },
        publicPath: '/',
        sourceMapFilename: '[name].[chunkhash].js.map',
    },
    experiments: {
        outputModule: true,
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
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] }),
        // new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: true }),
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
    target: 'node16.0',
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
    // node: { __dirname: true, __filename: true },
});

export default config;
