/* eslint-disable no-useless-catch */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import { GenericObject } from 'moleculer';
import { CdmLogger } from '@cdm-logger/core';
import { RedisConnector } from './RedisConnector';

type ILogger = CdmLogger.ILogger;

/**
 *  Connection broker class
 *
 * @class ConnectionBroker
 */
export class ConnectionBroker {
    private _redisConnector: RedisConnector;

    /**
     * Creates an instance of ConnectionBroker.
     * @param {*} options
     * @memberof ConnectionBroker
     */
    constructor(transporter: string | GenericObject, logger: ILogger) {
        this._redisConnector = new RedisConnector(); // TODO pass constructor options
    }

    /**
     * Connect to Redis and other services if needed
     *
     * @memberof ConnectionBroker
     */
    public async connect() {
        try {
            await this._redisConnector.connect();
            // Connect other services if needed
        } catch (error) {
            // Handle connection errors
            throw error;
        }
    }

    public get redisClient() {
        return this._redisConnector.getClient();
    }

    public async stop() {
        this._redisConnector && (await this._redisConnector.disconnect());
    }
}
