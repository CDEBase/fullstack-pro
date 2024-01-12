const base = require('../../jest.config.base');
const packageJson = require('./package');
const merge = require('merge')
const baseConfig = require('../../jest.config.base');
const mongodbConfig = require('../../jest.config.mongodb');

const mergeData = merge.recursive(
    baseConfig,
    {
        "transform": {
            "\\.(js|jsx)?$": "../../transform.js",
        },
        moduleNameMapper: {
            '^__mocks__/(.*)$': '<rootDir>/../../__mocks__/$1',
            // we'll use commonjs version of lodash for tests 👌
            // because we don't need to use any kind of tree shaking right?!
            '^lodash-es$': '<rootDir>/../../node_modules/lodash/index.js',
            '@adminide-stack\/core': '<rootDir>/../core/src/index.ts',
        },
        roots: [
            // "src",
            "loader"
        ],
    },
    mongodbConfig,
    {
        globals: {

        }
    }
);

module.exports = mergeData;