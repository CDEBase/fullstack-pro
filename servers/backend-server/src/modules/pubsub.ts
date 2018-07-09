import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { wrapPubSub } from 'apollo-logger';
import { logger } from '@common-stack/server-core';
import { SETTINGS } from '../config';
import * as nats from 'nats';

export const client: () => nats.Client = () => nats.connect({
    'url': SETTINGS.NATS_URL,
    'user': SETTINGS.NATS_USER,
    'pass': SETTINGS.NATS_PW as string,
    reconnectTimeWait: 1000,
});

export const pubsub = process.env.NODE_ENV === 'development' ?
    SETTINGS.apolloLogging ? wrapPubSub(new PubSub(), { logger: logger.debug.bind(logger) }) :
        new PubSub() : new NatsPubSub({ client: client(), logger });
