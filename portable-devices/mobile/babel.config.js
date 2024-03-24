module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env',
                    "allowUndefined": true,
                    ...(!!process.env.ENV_FILE && {path: process.env.ENV_FILE})
                },
            ],
            'react-native-reanimated/plugin',
        ],
    };
};
