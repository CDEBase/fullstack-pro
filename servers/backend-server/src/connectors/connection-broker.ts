
import { MongoConnector } from './mongo-connector';
import { NatsConnector } from './nats-connector';
import { RedisConnector } from './redis-connector';
import { config } from '../config';
import { logger } from '@cdm-logger/server';
import * as ILogger from 'bunyan';

/**
 *  Connection broker class
 *
 * @class ConnectionBroker
 */
export class ConnectionBroker {


    private _mongoConnector: MongoConnector;

    private _redisConnector: RedisConnector;

    private _natsConnector: NatsConnector;
    /**
     * Creates an instance of ConnectionBroker.
     * @param {*} options
     * @memberof ConnectionBroker
     */
    constructor(options?: any) {

        this._natsConnector = new NatsConnector({
            'url': config.NATS_URL,
            'user': config.NATS_USER,
            'pass': config.NATS_PW as string,
            reconnectTimeWait: 1000,
        });
        this._mongoConnector = new MongoConnector(config.MONGO_URL);
        this._redisConnector = new RedisConnector(); // TODO pass constructor options
    }


    public get mongoConnection() {
        return this._mongoConnector.connect();
    }

    public get redisConnection() {
        return this._redisConnector.connect();
    }

    public get natsConnection() {
        return this._natsConnector.connect();
    }

    public async stop() {
        await this._mongoConnector.disconnect();
        await this._redisConnector.disconnect();
        await this._natsConnector.disconnect();
    }
}

