export default {
  compact: false,
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', { modules: 'commonjs', loose: true }],
  ],
  plugins: [
    "codegen",
    "macros"
  ],
  env: {
    production: {
      compact: true,
    },
  },
};
