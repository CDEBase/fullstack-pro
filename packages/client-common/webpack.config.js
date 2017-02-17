import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const min = process.env.NODE_ENV === 'production' ? '.min' : '';

const config = {
  entry: {
    'client-common': './src/index.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },

      // { test: /\.png$|\.svg$/, loaders: ['url-loader'] },
      // { test: /\.eot$|\.ttf$|\.woff(2)?/, loaders: ['url-loader'] },

     { test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/, loader: 'url?limit=10000' },
     { test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/, loader: 'file' }
    ],
  },
  output: {
    path: './dist',
    filename: `[name]${min}.js`,
    library: 'CommonStack',
    libraryTarget: 'umd',
  },
  externals: {
    react: 'umd react',
  },

  // quiet the log output from the ExtractTextPlugin
  stats: { children: false },

  plugins: [
    new ExtractTextPlugin(`[name]${min}.css`),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
    })
  );
}

export default config;