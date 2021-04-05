const merge = require('merge')
const baseConfig = require('./jest.config.base');
const mongodbConfig = require('./jest.config.mongodb')
module.exports = merge.recursive(
    baseConfig,
    mongodbConfig,
    {
        globals: {

        }
    },
    // https://baltuta.eu/posts/typescript-lerna-monorepo-more-tools 
    // {
    //     roots: ['<rootDir>'],
    //     projects: [
    //         '<rootDir>/packages/ui',
    //         '<rootDir>/packages/api',
    //         '<rootDir>/packages/diceroll'
    //     ],
    // }

);