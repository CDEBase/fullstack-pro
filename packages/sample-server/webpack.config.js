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
  entry: './src/main.ts',
  target: 'node',
  output: {
    filename: distPath('main.js'),
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
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
      use: 'ts-loader',
      exclude: /(node_modules)/
    }, {
      test: /\.json$/,
      use: 'json-loader'
    },]
  },
  externals: [nodeExternals()]
};

module.exports = webpack_opts;
