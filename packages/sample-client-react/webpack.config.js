var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var libPath = require('../../tools/webpack-util');

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    libraryTarget: "commonjs2",
    library: "@sample/client-react"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.tsx?$/,
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
      test: /\.tsx?$/,
      loaders: 'ts-loader'
    }, {
      test: /\.json?$/,
      loaders: 'json-loader'
    },
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    },
    {
      test: /\.css$/,
      loaders: 'css-loader'
    },]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  { "@sample/core": "@sample/core" },
  { "@sample/client-core": "@sample/client-core" },
  { "@sample/graphql": "@sample/graphql" },
  { "@sample/schema": "@sample/schema" },
  { "@sample/client-redux": "@sample/client-redux" }]
};

module.exports = webpack_opts;
