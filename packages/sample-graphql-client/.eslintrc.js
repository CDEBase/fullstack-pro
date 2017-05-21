module.exports = {
  parser: 'babel-eslint',
  rules: {
    'graphql/template-strings': ['error', {
      env: 'apollo',
      schemaJson: require('./schema.json').data
    }],
  },
  plugins: [
    'graphql'
  ],
};
