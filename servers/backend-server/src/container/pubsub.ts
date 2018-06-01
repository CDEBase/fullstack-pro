import { PubSub } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { addApolloLogging } from 'apollo-logger';
import { logger } from '@sample-stack/utils';
import { SETTINGS } from '../config';
import * as nats from 'nats';

export const client = () => nats.connect({
    'url': SETTINGS.NATS_URL,
    'user': SETTINGS.NATS_USER,
    'pass': SETTINGS.NATS_PW as string,
    reconnectTimeWait: 1000,
});

export const pubsub = process.env.NODE_ENV === 'development' ?
    SETTINGS.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub() : new NatsPubSub({ client: client(), logger });
