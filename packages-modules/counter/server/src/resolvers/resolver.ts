import { IContext } from '../interfaces';
import { IResolvers, Counter } from '../generated-models';

const COUNTER_SUBSCRIPTION = 'counter_subscription';



export const resolver: (options: any) => IResolvers<IContext> = (options) => ({
  Query: {
    counter(obj, args, context ) {
      console.log('----CONTEXT', context.dataSources);
      return context.counterMockService.counterQuery() as Counter;
    },
    counterCache(obj, args, context ) {
      console.log('----CONTEXT', context.dataSources);
      return context.dataSources.counterCache.counterQuery() as Counter;
    },
    moleculerCounter(obj, args, context) {
      return context.counterMockProxyService.counterQuery();
    },
  },
  Mutation: {
    async addCounter(obj, { amount }, context ) {
      await context.counterMockService.addCounter(amount);
      const counter = await context.counterMockService.counterQuery();

      options.pubsub.publish(COUNTER_SUBSCRIPTION, {
        counterUpdated: { amount: counter.amount },
      });

      return counter;
    },
    async addMoleculerCounter(obj, { amount },  { counterMockProxyService } ) {
      await counterMockProxyService.addCounter(amount);
      const counter = await counterMockProxyService.counterQuery();

      options.pubsub.publish(COUNTER_SUBSCRIPTION, {
        moleculerCounterUpdate: { amount: counter.amount },
      });

      return counter;
    },
    async syncCachedCounter(obj, args, context) {
      await context.dataSources.counterCache.addCounter();
      return true;
    },
  },
  Subscription: {
    counterUpdated: {
      subscribe: () => options.pubsub.asyncIterator(COUNTER_SUBSCRIPTION),
    },
    moleculerCounterUpdate: {
      subscribe: () => options.pubsub.asyncIterator(COUNTER_SUBSCRIPTION),
    },
  },
});
