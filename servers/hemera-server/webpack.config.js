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
    rules: [
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
    ]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" })]

};

module.exports = webpack_opts;
