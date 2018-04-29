var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var libPath = require('../../tools/webpack-util');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    new ExtractTextPlugin("lib/styles.css"),
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
    { test: /\.svg$/, loader: 'url-loader?limit=10000' },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { config: { path: './src/postcss.config.js' } } }
        ]
      })
    },
  ]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;
