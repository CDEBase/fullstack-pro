var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
// var PersistGraphQLPlugin = require('persistgraphql-webpack-plugin');
var path = require('path');
var fs = require('fs');


var webpack_opts = {   mode: 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'lib'),    
    filename: 'index.js',
    libraryTarget: "commonjs2",
    library: "@sample-stack/graphql-gql",
  },
  resolve: {
    extensions: ['.ts', '.graphql', '.gql'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    // new PersistGraphQLPlugin({
    //   filename: 'persisted_queries.json',
    //   moduleName: path.resolve('node_modules/persisted_queries.json')
    // }),
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
      use: ['graphql-tag/loader']
    },
    {
      test: /\.json?$/,
      use: 'json-loader'
    },]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;
