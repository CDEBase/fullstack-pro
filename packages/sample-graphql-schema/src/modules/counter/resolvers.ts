import { ICounterRepository, ICount } from './database';

export const resolver = (pubsub) => ({
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

            // pubsub.publish('countUpdated', count);

            return count;
        },
    },
    Subscription: {
        countUpdated(amount) {
            return amount;
        },
    },
});
