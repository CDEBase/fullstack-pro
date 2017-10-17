const { database }: any = require('../../config/development/settings.json');
export const development = {
    ...database,
    'seeds': {
        'directory': __dirname + '/src/database/seeds',
    },
    'migrations': {
        'directory': __dirname + '/src/database/migrations',
    },
};
// database need to come from environment file.
// export const staging = {
//     ...database,
//     'seeds': {
//         'directory': __dirname + '/src/database/seeds',
//     },
//     'migrations': {
//         'directory': __dirname + '/src/database/migrations',
//     },
// };

// export const production = {
//     ...database,
//     'migrations': {
//         'directory': __dirname + '/src/database/migrations',
//     },
// };

