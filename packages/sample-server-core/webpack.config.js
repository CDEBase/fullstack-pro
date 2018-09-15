var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');


var webpack_opts = {   
  mode: 'development',
  entry: {
    index: './src/index.ts',
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: "[name].js",
    library: '@sample-stack/server-core',
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: ['.ts', '.js']
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
      loaders: 'ts-loader'
    }]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;
