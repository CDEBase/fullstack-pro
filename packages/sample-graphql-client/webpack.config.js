var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('cdm-webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var libPath = require('../../src/webpack-util');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    
    filename: libPath("index.js"),
    library: '@sample/graphql',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js', '.graphql'],
    modules: [
      'src',
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/**/*.graphql', to: 'lib'}
    ]),
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
    },
    // {
    //   test: /\.graphql$/,
    //   loader: 'raw',
    //   exclude: /node_modules/,
    // }, 
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    },
    ]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  {
    "@sample/client-core": "@sample/client-core"
  }]
};
