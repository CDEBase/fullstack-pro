const url = require('url');

const config = {
    builders: {
        web: {
            entry: './src/index.tsx',
            stack: ['web'],
            tsLoaderOptions: {
                configFileName: "./tsconfig.json"
            },
            openBrowser: true,
            defines: {
                __CLIENT__: true
            },
            htmlTemplate: "../../tools/html-plugin-template.ejs",
            // Wait for backend to start prior to letting webpack load frontend page
            waitOn: ['tcp:localhost:8080'],
            enabled: true
        },
        test: {
            stack: ['server'],
            roles: ['test'],
            defines: {
                __TEST__: true
            }
        }
    },
    options: {
        stack: [
            "apollo",
            "ts",
            "react",
            "webpack",
            "css"
        ], 
        cache: '../../.cache',
        backendBuildDir: "dist",
        frontendBuildDir: "dist",
        dllBuildDir: "dist/.build/dll",
        ssr: false,
        webpackDll: true,
        reactHotLoader: false,
        persistGraphQL: false,
        frontendRefreshOnBackendChange: true,
        defines: {
            __DEV__: process.env.NODE_ENV !== 'production',
            __BACKEND_URL__: '"http://localhost:8080"',
            __GRAPHQL_URL__: '"http://localhost:8080/graphql"'
        }
    }
};

config.options.devProxy = config.options.ssr;

if (process.env.NODE_ENV === 'production') {
    config.options.defines.__BACKEND_URL__ = '"http://localhost:8080/graphql"';
    // Generating source maps for production will slowdown compilation for roughly 25%
    config.options.sourceMap = false;
}

const extraDefines = {
    __SSR__: config.options.ssr,
    __PERSIST_GQL__: config.options.persistGraphQL
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;