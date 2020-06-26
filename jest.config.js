const merge = require('merge')
const baseConfig = require('./jest.config.base');
const mongodbConfig = require('./jest.config.mongodb')
module.exports = merge.recursive(
    baseConfig,
    mongodbConfig,
    {
        globals: {

        }
    });