import { PubSub } from 'graphql-subscriptions';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { app as settings } from '../../../../config/development/settings.json';
import { addApolloLogging } from 'apollo-logger';
import { logger } from '@sample-stack/utils';

export const pubsub = process.env.NODE_ENV === 'development' ?
    settings.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub() : new NatsPubSub({ logger });
