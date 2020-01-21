var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var webpack_opts = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    plugin: './src/plugin/index.ts',
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: "commonjs2",
  },
  node: {
    __dirname: false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.graphql', '.gql'],
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
      test: /\.graphql?/,
      exclude: /node_modules/,
      use: 'raw-loader',
    }, {
      test: /\.(gql)$/,
      exclude: /node_modules/,
      use: ['graphql-tag/loader']
    }
    ]
  },
  externals: [
    nodeExternals({ modulesDir: "../../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;
