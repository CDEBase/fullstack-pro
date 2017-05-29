var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('cdm-webpack-node-externals');
var libPath = require('../../tools/webpack-util');

var webpack_opts = {
  entry: {
    index: './src/index.ts',
    'validation.test': './src/__tests__/validation.ts'
  },
  target: 'node',
  output: {
    filename: libPath('[name].js'),
    library: '@sample/schema',
    libraryTarget: 'commonjs2',
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
    },
    {
      test: /\.graphql?/,
      use: 'raw-loader'
    },]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  { "@sample/server-core": "@sample/server-core" }]
};

module.exports = webpack_opts;