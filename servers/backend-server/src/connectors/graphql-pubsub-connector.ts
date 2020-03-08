import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { wrapPubSub } from 'apollo-logger';
import { logger } from '@cdm-logger/server';
import { ClientOpts } from 'nats';
import * as ILogger from 'bunyan';
import { Transporter, GenericObject } from 'moleculer';




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
    }

    public getClient() {
        if (this.opts.type === 'TCP') {
            if (this.opts.apolloLogging) {
                return this.client = wrapPubSub(new PubSub(), { logger: this.logger.trace.bind(this.logger) });
            }
            return this.client = new PubSub();
        } else if (this.opts.type === 'NATS') {
            return this.client = new NatsPubSub({ client: this.opts.options, logger });
        } else {
            this.logger.warn('Did not defined known transporter [%s], return default pubsub', this.opts.type);
            return this.client = new PubSub();
        }
    }
}