import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { wrapPubSub } from 'apollo-logger';
import { logger } from '@cdm-logger/server';
import { config } from '../config';
import { clientGen } from './nats-connection';

export const pubsub = config.NODE_ENV === 'development' ?
    config.apolloLogging ? wrapPubSub(new PubSub(), { logger: logger.debug.bind(logger) }) :
        new PubSub() : new NatsPubSub({ client: clientGen(), logger });
