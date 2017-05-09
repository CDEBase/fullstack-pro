var failPlugin = require('webpack-fail-plugin');
const { CheckerPlugin } = require("awesome-typescript-loader");
var Visualizer = require("webpack-visualizer-plugin");
const webpack = require("webpack");
const path =  require("path");

var corePlugins = [
  failPlugin,
  new CheckerPlugin(),
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
  }),
  new Visualizer({
    filename: './dist/statistics.html'
  })
];


var devePlugins = [
  // Add dev plugins here
];

var prodPlugins = [
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.DedupePlugin()
];

var plugins = process.env.NODE_ENV === "production" ? corePlugins.concat(prodPlugins) : corePlugins.concat(devePlugins)

// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: './dist/bundle.js',
  },
  devServer: {
    inline: true
  },

  // enable sourcemaps for debugging webpack's output.
  devtool: "source-map",


  resolve: {
    // add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css'],
  },

  plugins: plugins,
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /(node_modules)/
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: 'source-map-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /(node_modules)/
      },
      /**
       * Raw loader support for *.scss files
       *
       * See: https://github.com/webpack/raw-loader
       */
      {
        test: /\.scss$/,
        loader: ['raw-loader', 'sass-loader'],
      },
      /**
      * Raw loader support for *.css files
      *
      * See: https://github.com/webpack/raw-loader
      */
      {
        test: /\.css$/,
        loader: ['css-loader'],
      },
    ]
  },
};
