// Update with your config settings.
var path = require('path');
require('dotenv').config({ path: process.env.ENV_FILE });

var connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  socketPath: process.env.DB_SOCKET_PATH,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
  charset: 'utf8',
};
var DB_CLIENT = process.env.DB_TYPE || 'sqlite3';

var migrations_path = path.dirname(require.resolve('@sample-stack/store/lib/store/migrations/index'));
var seeds_path = path.dirname(require.resolve('@sample-stack/store/lib/store/seeds/index'));
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev-db.sqlite3'
    },
    seeds: {
      directory: seeds_path,
    },
    migrations: {
      directory: migrations_path,
    },
    useNullAsDefault: true,
  },

  test: {
    client: DB_CLIENT,
    connection: connection,
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: seeds_path,
    },
    migrations: {
      directory: migrations_path,
    },
    useNullAsDefault: true,
  },

  production: {
    client: DB_CLIENT,
    connection: connection,
    pool: {
      min: 2,
      max: 200
    },
    migrations: {
      directory: migrations_path,
    },
    useNullAsDefault: true,
  }

};
