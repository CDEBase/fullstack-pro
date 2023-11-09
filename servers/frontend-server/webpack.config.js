/* eslint-disable no-underscore-dangle */
const webpack = require('webpack');
const path = require('path');
const waitOn = require('wait-on');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const zlib = require('zlib');
const EnvListPlugin = require('@common-stack/env-list-loader');
const ServerConfig = require('../../tools/webpack/server.config');

const bundleStats = process.env.BUNDLE_STATS || false;
const buildConfig = require('./build.config');

const modulenameExtra = process.env.MODULENAME_EXTRA ? `${process.env.MODULENAME_EXTRA}|` : '';
const modulenameRegex = new RegExp(`node_modules(?![\\\\/](${modulenameExtra}@sample-stack)).*`);

const plugins = [
    new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
    }),
    // new CopyWebpackPlugin({
    //     patterns: [{ from: './public/.well-known', to: './.well-known' }],
    // }),
];
if (bundleStats) {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

if (!buildConfig.__SSR__ && buildConfig.__DEV__) {
    const dotenv = require('dotenv-safe').config({
        allowEmptyValues: true,
        path: process.env.ENV_FILE,
        example: '../../config/development/dev.env',
    });
    plugins.push(
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(dotenv.parsed),
        }),
    );
}

const isDevelopment = process.env.NODE_ENV !== 'production';
class WaitOnWebpackPlugin {
    constructor(waitOnUrl) {
        this.waitOnUrl = waitOnUrl;
        this.done = false;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('WaitOnPlugin', (compilation, callback) => {
            if (!this.done) {
                console.log(`Waiting for backend at ${this.waitOnUrl}`);
                waitOn({ resources: [this.waitOnUrl] }, () => {
                    console.log(`Backend at ${this.waitOnUrl} has started`);
                    this.done = true;
                    callback();
                });
            } else {
                callback();
            }
        });
    }
}

/**
 * Webpack 5 need manual polyfills. If you need to add anything you can check the following link
 * https://gist.github.com/ef4/d2cf5672a93cf241fd47c020b9b3066a
 */
const config = {
    entry: {
        index: ['raf/polyfill', 'core-js/stable', 'regenerator-runtime/runtime', './src/index.tsx'],
    },
    name: 'web',
    module: {
        rules: [
            { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
            {
                test: /\.(png|ico|jpg|gif|xml)$/,
                use: { loader: 'url-loader', options: { name: '[fullhash].[ext]', limit: 100000 } },
            },
            {
                // searches for files ends with <dir>/config/env-config.js or <dir>/config/public-config.js
                test: /config\/(env-config|public-config)\.(j|t)s/,
                use: {
                    loader: '@common-stack/env-list-loader',
                },
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: { loader: 'url-loader', options: { name: '[fullhash].[ext]', limit: 100000 } },
            },
            {
                test: /\.ttf(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: { loader: 'url-loader', options: { name: '[fullhash].[ext]', limit: 100000 } },
            },
            {
                test: /\.(otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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
                    options: {
                        babelrc: true,
                        rootMode: 'upward-optional',
                        plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                    },
                },
            },
            {
                // searches for files ends with <dir>/config/env-config.js or <dir>/config/public-config.js
                test: /config\/(env-config|public-config)\.(j|t)s/,
                use: {
                    loader: '@common-stack/env-list-loader',
                },
            },
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
        fallback: {
            assert: 'assert/',
            buffer: 'buffer/',
            constants: 'constants-browserify',
            fs: false,
            path: require.resolve('path-browserify'),
            http: 'stream-http',
            https: 'https-browserify',
            os: 'os-browserify/browser',
            process: 'process/browser.js',
            stream: 'stream-browserify',
            _stream_duplex: 'readable-stream/duplex',
            _stream_passthrough: 'readable-stream/passthrough',
            _stream_readable: 'readable-stream/readable',
            _stream_transform: 'readable-stream/transform',
            _stream_writable: 'readable-stream/writable',
            string_decoder: 'string_decoder/',
            zlib: 'browserify-zlib',
        },
        alias: {
            // process: 'process/browser.js',
            stream: 'stream-browserify',
            // zlib: 'browserify-zlib',
        },
    },
    watchOptions: { ignored: /dist/ },
    output: {
        pathinfo: false,
        filename: '[name].[fullhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.join(__dirname, `${buildConfig.__FRONTEND_BUILD_DIR__}`),
        publicPath: '/',
    },
    devtool: process.env.NODE_ENV === 'production' ? 'nosources-source-map' : 'eval-cheap-source-map',
    mode: process.env.NODE_ENV || 'development',
    performance: { hints: false },
    plugins: (process.env.NODE_ENV !== 'production'
        ? []
              .concat(
                  typeof STORYBOOK_MODE === 'undefined'
                      ? [
                            new WaitOnWebpackPlugin(
                                `tcp:${buildConfig.__SERVER_HOST__}:${buildConfig.__API_SERVER_PORT__}`,
                            ),
                        ]
                      : [],
              )
              .concat(
                  new Dotenv({
                      path: process.env.ENV_FILE,
                  }),
              )
              .concat(new ReactRefreshWebpackPlugin({ overlay: false }))
        : [
              new MiniCSSExtractPlugin({
                  chunkFilename: '[name].[id].[chunkhash].css',
                  filename: `[name].[chunkhash].css`,
              }),
              new CompressionPlugin({
                  filename: '[path][base].gz',
                  algorithm: 'gzip',
                  test: /\.js$|\.css$|\.html$/,
                  threshold: 10240,
                  minRatio: 0.8,
              }),
              new CompressionPlugin({
                  filename: '[path][base].br',
                  algorithm: 'brotliCompress',
                  test: /\.(js|css|html|svg)$/,
                  compressionOptions: {
                      params: {
                          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                      },
                  },
                  threshold: 10240,
                  minRatio: 0.8,
              }),
          ]
    )
        .concat([
            ...plugins,
            // The plugin lists the environment that required as well recommendation about the keys used.
            new EnvListPlugin.Plugin(),
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] }),
            new webpack.DefinePlugin(
                Object.assign(
                    ...Object.entries(buildConfig).map(([k, v]) => ({
                        [k]: typeof v !== 'string' ? v : `"${v.replace(/\\/g, '\\\\')}"`,
                    })),
                ),
            ),
            new WebpackManifestPlugin({ fileName: 'assets.json' }),
            new LoadablePlugin(),
        ])
        .concat(
            buildConfig.__SSR__
                ? []
                : [
                      new HtmlWebpackPlugin({
                          template: '../../tools/html-plugin-template.ejs',
                          inject: true,
                          cache: false,
                      }),
                  ],
        ),
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: true,
        concatenateModules: false,
    },
    node: { __dirname: true, __filename: true },
    devServer: {
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        open: true,
        historyApiFallback: true,
        port: buildConfig.__WEB_DEV_SERVER_PORT__,
        devMiddleware: {
            publicPath: '/',
            writeToDisk: (pathname) => /(assets.json|loadable-stats.json)$/.test(pathname),
        },
        ...(buildConfig.__SSR__
            ? {
                  proxy: {
                      '!(/sockjs-node/**/*|/*.hot-update.{json,js})': {
                          target: 'http://localhost:8080',
                          logLevel: 'info',
                      },
                  },
              }
            : {}),
    },
};

const ServersConfig = buildConfig.__SSR__ && buildConfig.__SSR_BACKEND__ ? [] : [config];
if (buildConfig.__SSR__) {
    ServersConfig.push(
        ServerConfig({
            buildConfig: { ...buildConfig, __CLIENT__: false, __SERVER__: true },
            indexFilePath: './src/backend/app.ts',
            currentDir: __dirname,
        }),
    );
}
module.exports = ServersConfig;
