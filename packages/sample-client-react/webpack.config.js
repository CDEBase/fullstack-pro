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
    library: "@sample-stack/client-react"
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
  { "@sample-stack/core": "@sample-stack/core" },
  { "@sample-stack/client-core": "@sample-stack/client-core" },
  { "@sample-stack/graphql-gql": "@sample-stack/graphql-gql" },
  { "@sample-stack/graphql-schema": "@sample-stack/graphql-schema" },
  { "@sample-stack/client-redux": "@sample-stack/client-redux" }]
};

module.exports = webpack_opts;
