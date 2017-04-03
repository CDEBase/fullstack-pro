var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var libPath = require('../../src/webpack-util');

var webpack_opts = {
  entry: {
    index: './src/index.ts',
  },
  target: 'node',
  output: {
    filename: libPath("[name].js"),
    libraryTarget: "commonjs2"
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
      loaders: 'awesome-typescript-loader'
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  externals: [nodeExternals()]
};

module.exports = webpack_opts;
