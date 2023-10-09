/* eslint-disable no-return-assign */
import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { logger } from '@cdm-logger/server';
import { GenericObject } from 'moleculer';
import { CdmLogger } from '@cdm-logger/core';

type ILogger = CdmLogger.ILogger;

type PubSubOptions = {
    logger: ILogger;
} & GenericObject;

export class GraphqlPubSubConnector {
    private client: PubSubEngine | NatsPubSub;

    private opts: PubSubOptions;

    private logger: ILogger;

    /**
     * Creates an instance of GraphqlPubSubConnector.
     * @param {*} opts
     * @memberof GraphqlPubSubConnector
     */
    constructor(opts?: PubSubOptions) {
        this.opts = opts;
        this.logger = opts.logger.child({ className: 'GraphqlPubSubConnector' });
    }

    public async getClient() {
        if (this.opts.type === 'TCP') {
            return (this.client = new PubSub());
        }
        if (this.opts.type === 'NATS') {
            // console.log('--this.copts', this.opts.client)
            const natsClient = await this.opts.client.connect();
            return (this.client = new NatsPubSub({ client: natsClient, logger }));
        }
        this.logger.warn('Did not defined known transporter [%s], return default pubsub', this.opts.type);
        return (this.client = new PubSub());
    }
}
