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
    library: "@sample-stack/graphql",
  },
  resolve: {
    extensions: ['.ts', '.graphql', '.gql'],
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
      use: 'ts-loader'
    },
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: "graphql-tag/loader"
    },
    {
      test: /\.json?$/,
      use: 'json-loader'
    },]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" })]
};

module.exports = webpack_opts;
