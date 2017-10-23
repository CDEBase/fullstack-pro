import { PubSub } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { addApolloLogging } from 'apollo-logger';
import { logger } from '@sample-stack/utils';
import { SETTINGS } from '../config';

export const pubsub = process.env.NODE_ENV === 'development' ?
    SETTINGS.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub() : new NatsPubSub({ logger });
