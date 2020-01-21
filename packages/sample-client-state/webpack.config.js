var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');


var webpack_opts = {   
  mode: 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js', '.graphql', '.gql', '.graphqls'],
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
      test: /\.(gql)$/,
      exclude: /node_modules/,
      use: ['graphql-tag/loader']
    },
    {
      test: /\.graphql?/,
      exclude: /node_modules/,
      use: 'raw-loader',
    }
  ]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;