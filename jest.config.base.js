const { defaults } = require("jest-config");

module.exports = {
  testEnvironment: "node",
  setupFiles: [
    // needed for UI to mock canvas load
    // "jest-canvas-mock"
  ],
  preset: "ts-jest",
  testMatch: null,
  testRegex: ".*test*\\.(ts|tsx|js)$",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  transform: {
    "\\.(gql|graphql)$": "jest-transform-graphql",
    "\\.(graphqls)$": "jest-raw-loader",
    "\\.(ts|tsx)$": "ts-jest",
    // Use our custom transformer only for the *.js and *.jsx files
    "\\.(js|jsx)?$": "./transform.js",
    // future need to test with
    //  "^.+\\.(js|jsx|ts|tsx)$": "./transform.js",
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
  },
  roots: [
    "packages",
    "packages-modules",
    "servers"
  ],
  moduleFileExtensions: [
    "tsx", // TODO can be removed as default extension includes
    "ts", // TODO can be removed as default extension includes
    ...defaults.moduleFileExtensions,
    "js", // TODO can be removed as default extension includes
    "jsx", // TODO can be removed as default extension includes
    "json",
    "gql",
    "graphql"],
  moduleNameMapper: {
    '^__mocks__/(.*)$': '<rootDir>/../../__mocks__/$1',
    // we'll use commonjs version of lodash for tests 👌
    // because we don't need to use any kind of tree shaking right?!
    '^lodash-es$': '<rootDir>/node_modules/lodash/index.js'
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(babel-runtime|antd)).*/",
    "<rootDir>/node_modules/(?!lodash-es/.*)"
  ],
  clearMocks: true,
  verbose: true,
  // projects: ['<rootDir>'], // TODO need to test with it https://github.com/bryan-hunter/yarn-workspace-lerna-monorepo/blob/master/jest.config.base.js
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/lib/',
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
  globals: {
    __BACKEND_URL__: 'http://localhost:3010',
    __GRAPHQL_URL__: 'http://localhost:8085/graphql',
    "ts-jest": {
      // tsConfig: "<rootDir>/src/__tests__/tsconfig.json",
      // https://github.com/kulshekhar/ts-jest/issues/766
      "diagnostics": {
        "warnOnly": true
      },
      // "skipBabel": true
    }
  }
};