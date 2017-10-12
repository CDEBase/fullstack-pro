import { ICounterRepository, ICount } from '@sample-stack/store';
import { PubSub } from 'graphql-subscriptions';
import * as Logger from 'bunyan';

const COUNT_UPDATED_TOPIC = 'count_updated';

export const resolver = (pubsub: PubSub, logger?: Logger) => ({
    Query: {
        count(obj, args, context: { Count: ICounterRepository }) {
            logger.debug('quering the count table');
            return context.Count.getCount();
        },
    },
    Mutation: {
        async addCount(obj, { amount }, context: { Count: ICounterRepository }) {
            logger.debug('adding count...');

            await context.Count.addCount(amount);
            let count = await context.Count.getCount();
            logger.debug('added count and the amount is {%s} ', count);
            pubsub.publish(COUNT_UPDATED_TOPIC, { coutUpdated: { amount: count.amount } });
            return count;
        },
    },
    Subscription: {
        countUpdated: {
            subscribe: () => pubsub.asyncIterator(COUNT_UPDATED_TOPIC),
        },
    },
});
