module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest',
            storageEngine: 'wiredTiger',
        },
        binary: {
            version: '4.0.27', // Version of MongoDB
            skipMD5: true,
        },
        autoStart: false,
    },
};
