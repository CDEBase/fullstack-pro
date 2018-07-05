var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var webpack_opts = {   
  mode: 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: 'index.js',
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
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
      }
    ]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]

};

module.exports = webpack_opts;
