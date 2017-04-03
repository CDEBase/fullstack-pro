var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var libPath = require('../../src/webpack-util');

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: libPath('index.js'),
    library: '@sample/schema',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFileName: 'tsconfig.json'
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
    }]
  },
  externals: [nodeExternals()]
};

module.exports = webpack_opts;