var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var fs = require('fs');
var libPath = require('../../tools/webpack-util');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var glob_entries1 = function (globPath) {
  var files = glob.sync(globPath);
  var entries = {};

  for (var i = 0; i < files.length; i++) {
    var entry = files[i];
    var pathObj = path.parse(entry);
    entries[path.join(pathObj.dir.replace(new RegExp('^\.\/src\/database-store', ''), 'store'), pathObj.name)] = entry;
  }
  return entries;
};

var webpack_opts = {
  entry: {
    index: './src/index.ts',
    ...glob_entries1("./src/database-store/**/*.ts"),
    // "store/migrations/counter": './src/database-store/migrations/counter.ts',
    // "store/seeds/counter": './src/database-store/seeds/counter.ts',
  },
  target: 'node',
  output: {
    filename: libPath('[name].js'),
    libraryTarget: "commonjs2",
    library: "@sample-stack/store",
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/database-store/',
        to: 'lib/store-1',
      }
    ]),
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
    }, {
      test: /\.json?$/,
      loader: 'json-loader'
    },]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  { "@sample-stack/core": "@sample-stack/core" },
  { "@sample-stack/server-core": "@sample-stack/server-core" }]
};

module.exports = webpack_opts;
