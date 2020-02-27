import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { Db } from 'mongodb';
import { logger } from '@cdm-logger/server';
import * as ILogger from 'bunyan';



export class MongoConnector {

    private client: mongoose.Connection;
    private db: Db;
    private opts: mongoose.ConnectionOptions;
    private uri: string;
    private logger: ILogger;

    constructor(uri: string, opts?: mongoose.ConnectionOptions) {
        this.opts = _.defaultsDeep(opts, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.uri = uri;
        this.logger = logger.child({className: 'MongoConnector'});
    }
    /**
     * Connect to database
     *
     * @memberof MongoConnector
     */
    public connect() {
        if (this.client) {
            return this.client;
        }
        const conn = mongoose.createConnection(this.uri, this.opts);

        conn.then(result => {
            this.client = conn;

            if ((result as any).connection) {
                this.db = (result as any).conection.db;
            } else {
                this.db = result.db;
            }

            this.logger.info(' MongoDB has connected successfully.');

            this.db.on('disconnected', () => this.logger.warn('Mongoose has disconnected.'));
            this.db.on('error', err => this.logger.error('MongoDB error.', err));
            this.db.on('reconnect', () => this.logger.info('Mongoose has reconnected.'));
        });
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
        if (this.db && (this.db as any).close) {
            await (this.db as any).close();
        }
        await mongoose.connection.close();
    }
}
