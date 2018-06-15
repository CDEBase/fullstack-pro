<<<<<<< HEAD
const webpack = require('webpack');
const debug = process.env.DEBUGGING || false;
// App-specific back-end Webpack config should be here
const server = {
     entry: {
       index: [
        './src/setup/app.ts'        
       ]
     },
     plugins: [
         new webpack.DefinePlugin({
             __DEBUGGING__: JSON.stringify(debug),
         })
     ]
};

// App-specific web front-end Webpack config should be here
const web = {
    entry: {
        index: [
            './src/index.tsx'
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEBUGGING__: debug,
        }),
    ],
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
=======
>>>>>>> next

const dependencyPlatforms = {
    "@cdm-logger/server": 'server',
    "@sample-stack/utils": 'server',
    "@sample-stack/core": "*",
    "@sample-stack/client-core": "*",
    "@sample-stack/client-react": "*",
    "@sample-stack/client-redux": "*",
    "@sample-stack/graphql-gql": "*",
    "@sample-stack/utils": "*",
    "@sample-stack/counter": "*",
    "bunyan": 'server',
    "export-dir": 'server',
    "express": 'server',
    'body-parser': 'server',
    express: 'server',
    'apollo-server-express': 'server',
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
    "apollo-server-express": 'server',
    "graphql-tools": 'server',
    "helmet": 'server',
    "hemera-joi": 'server',
    "hemera-plugin": 'server',
    "inversify": 'server',
    "morgan": 'server',
    "nats": 'server',
    "nats-hemera":'server',
    "nconf": 'server',
    "node-pre-gyp": 'server',
    "prop-types": 'web',
    "ramda": ['web', 'server'],
    "reflect-metadata": 'server',
    "sequelize": 'server',
    'react-native': ['ios', 'android'],
    'react-navigation': ['ios', 'android'],
    'serialize-javascript': 'server',
    'source-map-support': 'server',
    sqlite3: 'server',
    'styled-components': ['server', 'web'],
    'subscriptions-transport-ws': ['ios', 'android', 'web'],
    'ws': ['server']    
};

module.exports = { dependencyPlatforms };