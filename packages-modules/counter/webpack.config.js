var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var PersistGraphQLPlugin = require('persistgraphql-webpack-plugin');

var webpack_opts = {   
  mode: 'development',
  entry: {
    browser: './src/browser/index.ts',
    server: './src/server/index.ts',
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].js',
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
    new PersistGraphQLPlugin({
      filename: 'persisted_queries.json',
      moduleName: path.resolve('node_modules/persisted_queries.json')
    }),
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
      use: ['graphql-tag/loader']
    }]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;
