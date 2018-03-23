const url = require('url');

const config = {
    builders: {
        web: {
            entry: './src/index.tsx',
            stack: ['web'],
            tsLoaderOptions: {
                configFileName: "./tsconfig.json"
            },
            openBrowser: false,
            defines: {
                __CLIENT__: true,

            },
            htmlTemplate: "../../tools/html-plugin-template.ejs",
            // Wait for backend to start prior to letting webpack load frontend page
            waitOn: ['tcp:localhost:8080'],
            enabled: true
        },
        server: {
            entry: './src/backend/app.ts',
            stack: ['server'],
            tsLoaderOptions: {
                configFileName: "./tsconfig.json"
            },
            defines: {
              __SERVER__: true,
            },
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
        ssr: true,
        backendUrl: "http://localhost:3010",
        webpackDll: false,
        reactHotLoader: false,
        persistGraphQL: false,
        frontendRefreshOnBackendChange: true,
        nodeDebugger: false,
        overridesConfig:  "./tools/webpackAppConfig.js",
        defines: {
            __DEV__: process.env.NODE_ENV !== 'production',
            __GRAPHQL_URL__: '"http://localhost:8080/graphql"',
        }
    }
};

config.options.devProxy = config.options.ssr;

if (process.env.NODE_ENV === 'production') {
    config.options.defines.__BACKEND_URL__ = '"http://localhost:3010"';
    // Generating source maps for production will slowdown compilation for roughly 25%
    config.options.sourceMap = false;
}

const extraDefines = {
    __SSR__: config.options.ssr,
    __PERSIST_GQL__:`'${config.options.persistGraphQL}'`,
    __FRONTEND_BUILD_DIR__: `'${config.options.frontendBuildDir}'`,
    __DLL_BUILD_DIR__: `'${config.options.dllBuildDir}'`
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;