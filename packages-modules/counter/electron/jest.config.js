const base = require('../../../jest.config.base');
const packageJson = require('./package');

module.exports = {
    ...base,
    testEnvironment: 'jsdom', // This is overriden, from the base testEnvironment
    name: packageJson.name,
    displayName: packageJson.name,
};