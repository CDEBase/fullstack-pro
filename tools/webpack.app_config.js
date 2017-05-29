// App-specific front-end config should be here
const clientConfig = {
    entry: {
        bundle: ['./servers/frontend-server/src/index.tsx']
    }
}

// App-specific back-end config should be here
const serverConfig = {
    entry: {
        index: ['./servers/backend-server/src/index.ts']
    }
};

module.exports = {
    clientConfig: clientConfig,
    serverConfig: serverConfig
};