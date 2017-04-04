var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var libPath = require('../../src/webpack-util');

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    library: '@sample/client-redux',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
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
      use: 'ts-loader'
    }, {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: 'graphql-tag/loader'
    }]
  },
  externals: [nodeExternals()]
};

module.exports = webpack_opts;