var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

/* helper function to get into build directory */
var distPath = function (name) {
  if (undefined === name) {
    return path.join('dist');
  }

  return path.join('dist', name);
};

var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: distPath('index.js'),
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.json'],
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
      enforce: 'pre',
      test: /\.js$/,
      use: 'source-map-loader',
      exclude: /(node_modules)/
    }, {
      enforce: 'pre',
      test: /\.tsx?$/,
      use: 'source-map-loader'
    }, {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /(node_modules)/
    }, {
      test: /\.json?$/,
      use: 'json-loader'
    }, {
      test: /\.css$/,
      use: 'css-loader'
    },]
  },
  externals: [nodeExternals()]
};

module.exports = webpack_opts;
