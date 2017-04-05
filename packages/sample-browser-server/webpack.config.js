var failPlugin = require('webpack-fail-plugin');

// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: './dist/bundle.js',
  },

  // enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  plugins: [failPlugin],

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

  // when importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // this is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
