// App-specific front-end config should be here
const clientConfig = {
    entry: {
        bundle: ['./packages/sample-browser-server/src/index.tsx']
    }
}

// App-specific back-end config should be here
const serverConfig = {
    entry: {
        index: ['./packages/sample-server/src/index.ts']
    }
};

module.exports = {
    clientConfig: clientConfig,
    serverConfig: serverConfig
};