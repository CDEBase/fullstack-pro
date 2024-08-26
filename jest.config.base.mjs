/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import { defaults } from 'jest-config';

const packagesToTransform = [
    '@apollo/client',
    '@apollo/server',
    '@graphql-tools/schema',
    '@graphql-tools/mock',
    '@common-stack/client-core',
    '@common-stack/client-react',
    '@common-stack/core',
    '@common-stack/server-core',
    '@common-stack/cache-api-server',
    '@common-stack/remix-router-redux',
    '@common-stack/graphql-api',
    '@cdmbase/graphql-type-uri',
    '@cdm-logger/server',
    '@cdm-logger/core',
    '@cdm-logger/client',
    '@files-stack/core',
    '@files-stack/server-core',
    '@vscode-alt/monaco-editor',
    '@workbench-stack/core',
    '@workbench-stack/platform-server',
    'graphql',
    'abortable-rx',
    'lodash-es',
    'sort-keys',
    'is-plain-obj',
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
    'react-dnd-html5-backend',
    'react-sortable-tree',
    'react-dnd',
    'dnd-core',
];

const generateTransformIgnorePattern = (packages) => {
    const escapedPackages = packages.map((pkg) => pkg.replace(/\//g, '\\/'));
    return `/node_modules/(?!(${escapedPackages.join('|')})/).+\\.js$`;
};
const transformIgnorePattern = generateTransformIgnorePattern(packagesToTransform);

export default {
    testEnvironment: 'node',
    setupFiles: [
        // needed for UI to mock canvas load
        // "jest-canvas-mock"
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    preset: 'ts-jest',
    testMatch: null,
    testRegex: '.*test\\.(ts|tsx|js)$',
    testPathIgnorePatterns: ['/node_modules/', '/lib', '/dist/'],
    transform: {
        '\\.(gql)$': 'jest-transform-graphql',
        '\\.(graphql|graphqls)$': '@glen/jest-raw-loader',
        '\\.(ts|tsx)$': 'ts-jest',
        // // Use our custom transformer only for the *.js and *.jsx files
        '\\.(js|jsx)?$': './transform.mjs',
        // future need to test with
        //  "^.+\\.(js|jsx|ts|tsx)$": "./transform.js",
        '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
    },
    roots: ['packages', 'packages-modules', 'servers'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'json', 'gql', 'graphql'],
    moduleNameMapper: {
        '^__mocks__/(.*)$': '<rootDir>/../../__mocks__/$1',
        // we'll use commonjs version of lodash for tests 👌
        // because we don't need to use any kind of tree shaking right?!
        '^lodash-es$': '<rootDir>/node_modules/lodash/index.js',
    },
    transformIgnorePatterns: [transformIgnorePattern],
    clearMocks: true,
    verbose: true,
    // projects: ['<rootDir>'], // TODO need to test with it https://github.com/bryan-hunter/yarn-workspace-lerna-monorepo/blob/master/jest.config.base.js
    coverageDirectory: '<rootDir>/coverage/',
    coveragePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/lib/', '<rootDir>/dist/', '<rootDir>/node_modules/'],
    globals: {
        __BACKEND_URL__: 'http://localhost:3010',
        __GRAPHQL_URL__: 'http://localhost:8085/graphql',
        'ts-jest': {
            // tsConfig: "<rootDir>/src/__tests__/tsconfig.json",
            // https://github.com/kulshekhar/ts-jest/issues/766
            diagnostics: {
                warnOnly: true,
            },
            // "skipBabel": true
        },
    },
};
