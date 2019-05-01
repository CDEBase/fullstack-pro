import { IContext } from '../interfaces';

const COUNTER_SUBSCRIPTION = 'counter_subscription';



export const resolver = (options) => ({
  Query: {
    counter(obj, args, context: IContext) {
      return context.counterMock.counterQuery();
    },
  },
  Mutation: {
    async addCounter(obj, { amount }, context: IContext) {
      await context.counterMock.addCounter(amount);
      const counter = await context.counterMock.counterQuery();

      options.pubsub.publish(COUNTER_SUBSCRIPTION, {
        counterUpdated: { amount: counter.amount },
      });

      return counter;
    },
  },
  Subscription: {
    counterUpdated: {
      subscribe: () => options.pubsub.asyncIterator(COUNTER_SUBSCRIPTION),
    },
  },
});
