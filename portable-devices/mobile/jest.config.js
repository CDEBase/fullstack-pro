const base = require('../../../jest.config.base');
const packageJson = require('./package');

module.exports = {
    ...base,
    preset: 'jest-expo',
    modulePathIgnorePatterns: [
        '<rootDir>/node_modules/react-native/Libraries/react-native/',
        '<rootDir>/node_modules/react-native/Libraries/vendor/core/whatwg-fetch.js',
        '<rootDir>/node_modules/react-native/jest/',
        '<rootDir>/node_modules/haul/',
        '<rootDir>/portable-devices/mobile/.expo/',
        '<rootDir>/portable-devices/mobile/node_modules/'
    ],
    name: packageJson.name,
    displayName: packageJson.name,
};