const { defaults } = require("jest-config");

module.exports = {
    testEnvironment: "node",
    // setupFiles: [
    //     "<rootDir>/../apollo-server-env/dist/index.js"
    // ],
    preset: "ts-jest",
    testMatch: null,
    testRegex: ".*test*\\.(ts|tsx|js)$",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ],
    transform: {
        "\\.(gql|graphql)$": "jest-transform-graphql",
        "\\.(ts|tsx)$": "ts-jest",
        "^.+\\.js": "<rootDir>/node_modules/babel-jest",
        // ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform"
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
    ],
    roots: [
        "packages",
        "packages-modules",
        "servers",
        "tools"
    ],
    moduleFileExtensions: [...defaults.moduleFileExtensions,
        "ts",
        "tsx",
        "js",
        "gql",
        "graphql"],
    moduleNameMapper: {
        '^__mocks__/(.*)$': '<rootDir>/../../__mocks__/$1',
        // This regex should match the packages that we want compiled from source
        // through `ts-jest`, as opposed to loaded from their output files in
        // `dist`.
        // We don't want to match `apollo-server-env` and
        // `apollo-engine-reporting-protobuf`, because these don't depend on
        // compilation but need to be initialized from as parto of `prepare`.
        '^(?!apollo-server-env|apollo-engine-reporting-protobuf)(apollo-(?:server|datasource|cache-control|tracing|engine)[^/]*|graphql-extensions)(?:/dist)?((?:/.*)|$)': '<rootDir>/../../packages/$1/src$2'
    },
    clearMocks: true,
    globals: {
        __BACKEND_URL__: 'http://localhost:3010',
        __GRAPHQL_URL__: 'http://localhost:8085/graphql',
        "ts-jest": {
            // tsConfig: "<rootDir>/src/__tests__/tsconfig.json",
            diagnostics: false,
            "skipBabel": true
        }
    }
};