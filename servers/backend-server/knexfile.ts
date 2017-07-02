const { database }: any = require('../../app.json');
export const development = {
    ...database,
    'seeds': {
        'directory': __dirname + '/src/database/seeds',
    },
    'migrations': {
        'directory': __dirname + '/src/database/migrations',
    },
};

export const staging = {
    ...database,
    'seeds': {
        'directory': __dirname + '/src/database/seeds',
    },
    'migrations': {
        'directory': __dirname + '/src/database/migrations',
    },
};

export const production = {
    ...database,
    'migrations': {
        'directory': __dirname + '/src/database/migrations',
    },
};

