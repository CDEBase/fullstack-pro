import * as _ from 'lodash';
import * as IORedis from 'ioredis';
import { logger } from '@cdm-logger/server';
import { CdmLogger } from '@cdm-logger/core';
import { config } from '../../config';

type ILogger = CdmLogger.ILogger;

export class RedisConnector {
    private client: IORedis.Redis | IORedis.Cluster;

    private opts: IORedis.RedisOptions | IORedis.ClusterOptions;

    private logger: ILogger;

    /**
     * Creates an instance of Redis.
     *
     * @param {object} opts
     */
    constructor(opts?: IORedis.RedisOptions | IORedis.ClusterOptions) {
        this.opts = _.defaultsDeep(opts, {
            prefix: null,
        });
        this.logger = logger.child({ className: 'RedisConnector' });
    }

    /**
     * Connect to the Redis server
     *
     * @memberof RedisConnector
     */
    public async connect() {
        try {
            if (config.REDIS_CLUSTER_ENABLED) {
                if (!config.REDIS_CLUSTER_URL) {
                    throw new Error(`No nodes defined for cluster, ${config.REDIS_CLUSTER_URL}`);
                }
                this.logger.info('Setting Redis.Cluster connection');
                this.client = new IORedis.Cluster(config.REDIS_CLUSTER_URL as any, this.opts);
            } else {
                this.logger.info('Setting Redis connection');
                this.client = new IORedis(config.REDIS_URL as any, this.opts);
            }

            await this.client.connect();
            this.logger.info('Redis connection established');
        } catch (error) {
            this.logger.error('Error connecting to Redis:', error);
            throw error;
        }
    }

    /**
     * Get Redis client
     *
     * @memberof RedisConnector
     */
    public getClient() {
        if (!this.client) {
            throw new Error('Redis client not initialized. Call connect first.');
        }
        return this.client;
    }

    /**
     * Close Redis client connection.
     *
     * @memberof RedisConnector
     */
    public async disconnect() {
        if (!this.client) {
            return;
        }
        try {
            await this.client.quit();
            this.logger.info('Redis connection closed');
        } catch (error) {
            this.logger.error('Error closing Redis connection:', error);
            throw error;
        }
    }
}
