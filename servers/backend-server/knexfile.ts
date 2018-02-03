const path = require('path');
require('dotenv').config({ path: process.env.ENV_FILE });

let connection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    socketPath: process.env.DB_SOCKET_PATH,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
    charset: 'utf8',
};


const DB_CLIENT = process.env.DB_TYPE || 'sqlite3';
const pool = {};
const migrations_path = path.dirname(require.resolve('@sample-stack/store/lib/store/migrations/counter'));
const seeds_path = path.dirname(require.resolve('@sample-stack/store/lib/store/seeds/counter'));
export const development = {
    client: DB_CLIENT,
    connection: DB_CLIENT === 'sqlite3' ? { 'filename': 'dev-db.sqlite3' } : connection,
    'seeds': {
        'directory': seeds_path,
    },
    'migrations': {
        'directory': migrations_path,
    },
    useNullAsDefault: true,
};
// database need to come from environment file.
export const staging = {
    client: DB_CLIENT,
    connection,
    'seeds': {
        'directory': seeds_path,
    },
    'migrations': {
        'directory': migrations_path,
    },
    useNullAsDefault: true,
};

export const production = {
    client: DB_CLIENT,
    connection,
    'migrations': {
        'directory': migrations_path,
    },
    pool,
    useNullAsDefault: true,
};

