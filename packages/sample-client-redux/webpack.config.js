var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var libPath = require('../../tools/webpack-util');

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    libraryTarget: 'commonjs2',
    library: '@sample/client-redux',
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
    }]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  { "@sample/core": "@sample/core" },
  { "@sample/client-core": "@sample/client-core" }]
};

module.exports = webpack_opts;