var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var libPath = require('../../tools/webpack-util');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var webpack_opts = {
  entry: {
    index: './src/index.ts',
  },
  target: 'node',
  output: {
    filename: libPath('[name].js'),
    libraryTarget: "commonjs2",
    library: "@sample-stack/store",
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/database-store/',
        to: 'lib/store',
      }
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFile: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      loaders: 'ts-loader'
    }, {
      test: /\.json?$/,
      loader: 'json-loader'
    },]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  { "@sample-stack/core": "@sample-stack/core" },
  { "@sample-stack/server-core": "@sample-stack/server-core" }]
};

module.exports = webpack_opts;
