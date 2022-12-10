/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv-safe');

const Dotenv = require('dotenv-webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackPort = 3000;

const buildConfig = require('./build.config');

const modulenameExtra = process.env.MODULENAME_EXTRA ? `${process.env.MODULENAME_EXTRA}|` : '@admin-layout';
const modulenameRegex = new RegExp(`node_modules(?![\\\\/](${modulenameExtra}@gqlapp)).*`);

const config = {
    entry: {
        popup: ['raf/polyfill', 'regenerator-runtime/runtime', './src/popup.tsx'],
        options: ['raf/polyfill', 'regenerator-runtime/runtime', './src/options.tsx'],
        background: path.resolve('src/background.ts'),
        contentScript: path.resolve('src/contentScript.ts'),
    },
    name: 'web',
    module: {
        rules: [
            { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
            {
                test: /\.(png|ico|jpg|gif|xml)$/,
                use: { loader: 'url-loader', options: { name: '[hash].[ext]', limit: 100000 } },
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: { loader: 'url-loader', options: { name: '[hash].[ext]', limit: 100000 } },
            },
            {
                test: /\.(otf|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: { loader: 'file-loader', options: { name: '[hash].[ext]' } },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //   test: /\.css$/,
            //   use: [
            //     process.env.NODE_ENV === 'production' ? { loader: MiniCSSExtractPlugin.loader } : { loader: 'style-loader' },
            //     { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
            //     { loader: 'postcss-loader', options: { sourceMap: true } }
            //   ]
            // },
            // {
            //   test: /\.scss$/,
            //   use: [
            //     process.env.NODE_ENV === 'production' ? { loader: MiniCSSExtractPlugin.loader } : { loader: 'style-loader' },
            //     { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
            //     { loader: 'postcss-loader', options: { sourceMap: true } },
            //     { loader: 'sass-loader', options: { sourceMap: true } }
            //   ]
            // },
            {
                test: /\.less$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? { loader: MiniCSSExtractPlugin.loader }
                        : { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'less-loader', options: { javascriptEnabled: true, sourceMap: true } },
                ],
            },
            { test: /\.graphqls/, use: { loader: 'raw-loader' } },
            { test: /\.(graphql|gql)$/, use: [{ loader: 'graphql-tag/loader' }] },
            {
                test: /\.[jt]sx?$/,
                exclude: modulenameRegex,
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
        symlinks: false,
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
    watchOptions: { ignored: /build/ },
    output: {
        pathinfo: false,
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.join(__dirname, 'build'),
        publicPath: '/',
    },
    devtool: process.env.NODE_ENV === 'production' ? '#nosources-source-map' : '#cheap-module-source-map',
    mode: process.env.NODE_ENV || 'development',
    performance: { hints: false },
    plugins: (process.env.NODE_ENV !== 'production'
        ? [new webpack.HotModuleReplacementPlugin()]
        : [
              new MiniCSSExtractPlugin({
                  chunkFilename: '[name].[id].[chunkhash].css',
                  filename: `[name].[chunkhash].css`,
              }),
          ]
    )
        .concat([
            new CleanWebpackPlugin({
                cleanStaleWebpackAssets: false,
            }),
            new Dotenv({
                path: process.env.ENV_FILE,
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve('assets'),
                        to: path.resolve('build'),
                    },
                ],
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
            new ManifestPlugin({ fileName: 'assets.json' }),
            new HardSourceWebpackPlugin({
                cacheDirectory: path.join(
                    __dirname,
                    `../../node_modules/.cache/hard-source-${path.basename(__dirname)}`,
                ),
            }),
            new HardSourceWebpackPlugin.ExcludeModulePlugin([
                {
                    test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
                },
            ]),
        ])
        .concat(
            getHtmlPlugins(['popup', 'options']),
            // [new HtmlWebpackPlugin({ template: './html-plugin-template.ejs', title: 'Admin-Layout', inject: true })]
        ),
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: true,
        concatenateModules: false,
    },
    node: { __dirname: true, __filename: true, fs: 'empty', net: 'empty', tls: 'empty' },
    devServer: {
        host: '0.0.0.0',
        hot: true,
        public: `localhost:${webpackPort}`,
        publicPath: '/',
        headers: { 'Access-Control-Allow-Origin': '*' },
        open: true,
        quiet: false,
        noInfo: true,
        historyApiFallback: true,
        port: webpackPort,
        writeToDisk: (pathname) => /(assets.json|loadable-stats.json)$/.test(pathname),
        ...(buildConfig.__SSR__
            ? {
                  proxy: {
                      '!(/sockjs-node/**/*|/*.hot-update.{json,js})': {
                          target: 'http://localhost:8091',
                          logLevel: 'info',
                          ws: true,
                      },
                  },
              }
            : {}),
        disableHostCheck: true,
    },
};

module.exports = config;

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HtmlWebpackPlugin({
                inject: true,
                title: 'React Extension',
                filename: `${chunk}.html`,
                template: `assets/html/${chunk}.html`,
                chunks: [`vendors~options~popup`, `options~popup`, `runtime~${chunk}`, chunk],
            }),
    );
}
