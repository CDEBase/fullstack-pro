import { app } from 'electron';
import type { ConnectionOptions, EntityTarget } from 'typeorm';
import { createConnection, getConnection } from 'typeorm';
import path from 'path';
import { User } from '../../models';
import { getLogger } from '../logger';
import { isDev, isTest } from '../../../common';

const entities = [User];
// Database storage address
const storagePath = app.getPath('userData');

const connectConfig: ConnectionOptions = {
    type: 'sqlite',
    entities,
    database:
        // In-memory database under test
        /* istanbul ignore next */
        isTest ? ':memory:' : path.join(storagePath, 'database', `${isDev ? 'electron-template' : 'db'}.sqlite`),
};

/**
 * Get database link
 */
export const getDBConnection = async () => {
    const logger = getLogger('database');
    try {
        logger.info('Connect to the database...');
        const connection = await createConnection(connectConfig);
        logger.info('connection succeeded!');

        // A synchronization of the database is equivalent to initializing various tables
        // Otherwise it will report QueryFailedError: SQLITE_ERROR: no such table: User error
        await connection.synchronize();

        return connection;
    } catch (err) {
        logger.error('Database initialization failed, error message:');
        logger.error(err);
        return undefined;
    }
};

/**
 * Get a certain warehouse value
 * @param entity
 */
export function getRepository<T>(entity: EntityTarget<T>) {
    const conn = getConnection();
    return conn.getRepository(entity);
}
