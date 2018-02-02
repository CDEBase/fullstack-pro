// App-specific back-end Webpack config should be here
const server = {
     entry: {
       index: [
        './src/index.ts'        
       ]
     }
};

const dependencyPlatforms = {
    'body-parser': 'server',
    express: 'server',
    'graphql-server-express': 'server',
    'graphql-subscriptions': 'server',
    'graphql-tools': 'server',
    'immutability-helper': ['ios', 'android', 'web'],
    'isomorphic-fetch': 'server',
    knex: 'server',
    mysql2: 'server',
    persistgraphql: ['server', 'web'],
    'react-dom': 'web',
    'react-helmet': 'web',
    'react-hot-loader': 'web',
    'react-native': ['ios', 'android'],
    'react-navigation': ['ios', 'android'],
    'react-redux': 'web',
    'react-router': 'web',
    'react-router-dom': 'web',
    reactstrap: 'web',
    'redux-devtools-extension': 'web',
    'redux-form': 'web',
    'serialize-javascript': 'server',
    'source-map-support': 'server',
    sqlite3: 'server',
    'styled-components': ['server', 'web'],
    'subscriptions-transport-ws': ['ios', 'android', 'web'],
    'universal-cookie-express': 'server',
};

module.exports = { server, dependencyPlatforms };