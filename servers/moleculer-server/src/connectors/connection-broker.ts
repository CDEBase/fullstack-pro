
import { MongoConnector } from './mongo-connector';
import { NatsConnector } from './nats-connector';
import { RedisConnector } from './redis-connector';
import { config } from '../config';
import { GraphqlPubSubConnector } from './graphql-pubsub-connector';
import { Transporter, GenericObject } from 'moleculer';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;

/**
 *  Connection broker class
 *
 * @class ConnectionBroker
 */
export class ConnectionBroker {


    private _mongoConnector: MongoConnector;

    private _redisConnector: RedisConnector;

    private _natsConnector: NatsConnector;

    private _graphqlPubsubConnector: GraphqlPubSubConnector;

    /**
     * Creates an instance of ConnectionBroker.
     * @param {*} options
     * @memberof ConnectionBroker
     */
    constructor(transporter: string | GenericObject, logger: ILogger) {

        if (typeof transporter === 'string') {
            if (transporter === 'TCP') {
                this._graphqlPubsubConnector = new GraphqlPubSubConnector({ logger, type: 'TCP' });
            } else if (transporter === 'NATS') {
                this._natsConnector = new NatsConnector({});
                this._graphqlPubsubConnector = new GraphqlPubSubConnector({ logger, type: 'NATS', client: this._natsConnector});
            }
        } else {
            if (transporter.type === 'NATS') {
                this._natsConnector = new NatsConnector(transporter.options);
                this._graphqlPubsubConnector = new GraphqlPubSubConnector({ logger, ...transporter, client: this._natsConnector});
            }
        }

        this._mongoConnector = new MongoConnector(config.MONGO_URL as any);
        this._redisConnector = new RedisConnector(); // TODO pass constructor options
    }


    public get mongoConnection() {
        return this._mongoConnector.connect();
    }

    public get redisDataloaderClient() {
        return this._redisConnector.getRedisDataloaderClient();
    }

    public get natsConnection() {
        return this._natsConnector.connect();
    }

    public get graphqlPubsub() {
        return this._graphqlPubsubConnector.getClient();
    }

    public async stop() {
        this._mongoConnector && await this._mongoConnector.disconnect();
        this._redisConnector && await this._redisConnector.disconnect();
        this._natsConnector &&  await this._natsConnector.disconnect();
    }
}
