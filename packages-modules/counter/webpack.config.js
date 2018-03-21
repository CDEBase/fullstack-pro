var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var libPath = require('../../tools/webpack-util');

var webpack_opts = {
  entry: {
    browser: './src/browser/index.ts',
    server: './src/server/index.ts',
  },
  target: 'node',
  output: {
    filename: libPath('[name].js'),
    libraryTarget: "commonjs2",
    library: "@sample-stack/counter",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.graphql', '.gql'],
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
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: ['graphql-tag/loader', 'persistgraphql-webpack-plugin/graphql-loader']
    }]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;
