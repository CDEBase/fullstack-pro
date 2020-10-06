import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { wrapPubSub } from 'apollo-logger';
import { logger } from '@cdm-logger/server';
import { ClientOpts } from 'nats';
import { Transporter, GenericObject } from 'moleculer';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;




type PubSubOptions = {
    apolloLogging?: boolean;
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
        if (opts === undefined || opts.type === undefined) {
            this.opts = { ...opts, apolloLogging: true, type: 'TCP' };
        }
        this.opts = opts;
        this.logger = opts.logger.child({className: 'GraphqlPubSubConnector'});
    }

    public async getClient() {
        if (this.opts.type === 'TCP') {
            if (this.opts.apolloLogging) {
                return this.client = wrapPubSub(new PubSub(), { logger: this.logger.trace.bind(this.logger) });
            }
            return this.client = new PubSub();
        } else if (this.opts.type === 'NATS') {
            // console.log('--this.copts', this.opts.client)
            const natsClient = await this.opts.client.connect();
            return this.client = new NatsPubSub({ client: natsClient, logger });
        } else {
            this.logger.warn('Did not defined known transporter [%s], return default pubsub', this.opts.type);
            return this.client = new PubSub();
        }
    }
}
