

import * as _ from 'lodash';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import * as IORedis from 'ioredis';
import { logger } from '@cdm-logger/server';
import { config } from '../config';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;

export class RedisConnector {


    private client: RedisClusterCache | RedisCache;
    private opts: IORedis.ClusterOptions | IORedis.RedisOptions;
    private logger: ILogger;

    /**
     * Creats an instance of Redis.
     *
     * @param {object} opts
     */
    constructor(opts?: IORedis.ClusterOptions | IORedis.RedisOptions) {
        this.opts = _.defaultsDeep(opts, {
            prefix: null,
        });
        this.logger = logger.child({ className: 'RedisConnector' });
    }

    /**
     * Connect to the server
     *
     * @memberof RedisConnector
     */
    public connect() {
        return new Promise((resolve, reject) => {
            reject('this method not implemented');
        });
    }


    /**
     * Return redis or redis.cluster Dataloader Client
     *
     * @memberof RedisConnection
     */
    public getRedisDataloaderClient() {
        let client: RedisClusterCache | RedisCache;
        if (config.REDIS_CLUSTER_ENABLED) {
            if (!config.REDIS_CLUSTER_URL) {
                throw new Error(`No nodes defined for cluster, ${config.REDIS_CLUSTER_URL}`);
            }
            this.logger.info('Setting Redis.Cluster connection');
            client = new RedisClusterCache(config.REDIS_CLUSTER_URL as any, this.opts);
        } else {
            this.logger.info('Setting Redis connection');
            client = new RedisCache(config.REDIS_URL as any || this.opts);
        }
        return client;
    }

    /**
     * Close Redis client connection.
     *
     * @memberof RedisConnection
     */
    public disconnect() {
        if (!this.client) {
            return;
        }
        return this.client.close();
    }
}
