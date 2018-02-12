// App-specific back-end Webpack config should be here
const server = {
     entry: {
       index: [
        './src/setup/app.ts'        
       ]
     }
};

// App-specific web front-end Webpack config should be here
const web = {
    entry: {
        index: [
            './src/index.tsx'
        ]
    }
};

// App-specific Android React Native front-end Webpack config should be here
const android = {
    //  entry: {
    //    'index.mobile.bundle': [
    //      require.resolve('./react-native-polyfill.js'),
    //      './src/mobile/index.js'
    //    ]
    //  }
};

// App-specific iOS React Native front-end Webpack config should be here
const ios = {
    //  entry: {
    //    'index.mobile.bundle': [
    //      require.resolve('./react-native-polyfill.js'),
    //      './src/mobile/index.js'
    //    ]
    //  }
};

const dependencyPlatforms = {
    "@cdm-logger/server": 'server',
    "bunyan": 'server',
    "export-dir": 'server',
    "express": 'server',
    'body-parser': 'server',
    express: 'server',
    'graphql-server-express': 'server',
    'graphql-subscriptions': 'server',
    'graphql-tools': 'server',
    "graphql-tag": ['server', 'web'],
    'immutability-helper': ['ios', 'android', 'web'],
    'isomorphic-fetch': 'server',
    knex: 'server',
    mysql2: 'server',
    persistgraphql: ['server', 'web'],
    "graphql-nats-subscriptions": 'server',
    "graphql-server-core": 'server',
    "graphql-server-express": 'server',
    "graphql-subscriptions": 'web',
    "graphql-tools": 'server',
    "helmet": 'server',
    "hemera-joi": 'server',
    "hemera-plugin": 'server',
    "immutability-helper": 'web',
    "inversify": 'server',
    "morgan": 'server',
    "nats": 'server',
    "nats-hemera":'server',
    "nconf": 'server',
    "node-pre-gyp": 'server',
    "prop-types": 'web',
    "ramda": ['web', 'server'],
    "react": "web",
    "react-apollo": 'web',
    "redux": "web",
    "reflect-metadata": 'server',
    "sequelize": 'server',
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
    'ws': ['server']    
};

module.exports = { server, web, android, ios, dependencyPlatforms };