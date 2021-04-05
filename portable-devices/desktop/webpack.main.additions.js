const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

let config = {
    devtool: process.env.DEBUG_PROD === 'true' ? 'source-map' : 'none',
    target: 'electron-main',
    entry: './src/main/index.ts',
    mode: 'development',
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
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode:
                process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
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
        })
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

}



module.exports = config;
