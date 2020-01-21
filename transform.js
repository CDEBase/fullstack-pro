const config = {
    babelrc: false,
    presets: ["@babel/preset-env", "@babel/preset-react",
    // ["@babel/preset-typescript", { isTSX: true, allExtensions: true }]
  ],
    plugins: [
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      "@babel/plugin-transform-runtime",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-object-rest-spread",
    ],
  };
  module.exports = require("babel-jest").createTransformer(config);
  