import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { wrapPubSub } from 'apollo-logger';
import { logger } from '@cdm-logger/server';
import { config } from '../config';
import * as nats from 'nats';



export const pubsubGen = (client: nats.Client) => {
    console.log('----NODE ENV FOR PUBUSBGENT', config.NODE_ENV, client)
    return config.NODE_ENV === 'development' ?
        config.apolloLogging ? wrapPubSub(new PubSub(), { logger: logger.trace.bind(logger) }) :
            new PubSub() : new NatsPubSub({ client, logger });

};
