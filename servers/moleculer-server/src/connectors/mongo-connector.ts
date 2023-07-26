import { createConnection, connection, Connection, ConnectOptions, plugin } from 'mongoose';
import * as _ from 'lodash';
import { Db } from 'mongodb';
import { logExecutionTime, LoggerVerbosity } from 'mongoose-execution-time';
import { logger } from '@cdm-logger/server';
import { CdmLogger } from '@cdm-logger/core';
import { config } from '../config';

type ILogger = CdmLogger.ILogger;

export class MongoConnector {
    private client: Connection;

    private db: Db;

    private opts: ConnectOptions;

    private uri: string;

    private logger: ILogger;

    constructor(uri: string, opts?: ConnectOptions) {
        this.opts = _.defaultsDeep(opts, {});
        this.uri = uri;
        this.logger = logger.child({ className: 'MongoConnector' });
    }

    /**
     * Connect to database
     *
     * @memberof MongoConnector
     */
    public async connect(): Promise<Connection> {
        if (this.client) {
            return this.client;
        }
        const conn = createConnection(this.uri, this.opts).asPromise();

        conn.then((result) => {
            this.client = result;
            this.db = result.db;
            this.logger.info(' MongoDB has connected successfully.');
            result.on('disconnected', () => this.logger.warn('Mongoose has disconnected.'));
            result.on('error', (err) => this.logger.error('MongoDB error.', err));
            result.on('reconnect', () => this.logger.info('Mongoose has reconnected.'));
        });
        if (
            config.NODE_ENV === 'development' ||
            __DEBUGGING__ ||
            config.LOG_LEVEL === 'debug' ||
            config.LOG_LEVEL === 'trace'
        ) {
            plugin(logExecutionTime, {
                logger: this.logger,
                loggerVerbosity: LoggerVerbosity.High,
                loggerLevel: config.LOG_LEVEL,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
        // plugin(require('@kolinalabs/mongoose-consistent'), {
        //     actionDefault: 'no_action',
        // });
        return conn;
    }

    /**
     * Disconnect from database
     *
     * @memberof MongoConnector
     */
    public async disconnect() {
        if (!this.client) {
            return;
        }
        await connection.close();
    }
}
