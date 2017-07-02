import { ICounterRepository, ICount } from './database';
import { PubSub } from 'graphql-subscriptions';

const COUNT_UPDATED_TOPIC = 'count_updated';

export const resolver = (pubsub: PubSub) => ({
    Query: {
        count(obj, args, context: { Count: ICounterRepository }) {
            console.log(context.Count);
            return context.Count.getCount();
        },
    },
    Mutation: {
        async addCount(obj, { amount }, context: { Count: ICounterRepository }) {
            await context.Count.addCount(amount);
            let count = await context.Count.getCount();
            console.log('amount is ' + count);
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
