let connection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    socketPath: process.env.DB_SOCKET_PATH,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
    charset: 'utf8',
};

const DB_CLIENT = process.env.DB_CLIENT || 'sqlite3';
const pool = {};

export const development = {
    client: DB_CLIENT,
    connection: DB_CLIENT === 'sqlite3' ? { 'filename': 'dev-db.sqlite3' } : connection,
    'seeds': {
        'directory': __dirname + '/src/database/seeds',
    },
    'migrations': {
        'directory': __dirname + '/src/database/migrations',
    },
    useNullAsDefault: true,
};
// database need to come from environment file.
export const staging = {
    client: DB_CLIENT,
    connection,
    'seeds': {
        'directory': __dirname + '/src/database/seeds',
    },
    'migrations': {
        'directory': __dirname + '/src/database/migrations',
    },
    useNullAsDefault: true,
};

export const production = {
    client: DB_CLIENT,
    connection,
    'migrations': {
        'directory': __dirname + '/src/database/migrations',
    },
    pool,
    useNullAsDefault: true,
};

