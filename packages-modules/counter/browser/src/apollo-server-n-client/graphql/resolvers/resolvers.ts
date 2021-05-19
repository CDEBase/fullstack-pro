import { CounterQueryDocument } from '../../../generated-models';

const TYPE_NAME = 'CounterState';

const defaults = {
    counterState: {
        counter: 1,
        __typename: TYPE_NAME,
    },
};

const resolvers = {
    Query: {
        counterState: (_, args, { cache }) => {
            const {
                counterState: { counter },
            } = cache.readQuery({ query: CounterQueryDocument });
            return {
                counter,
                __typename: TYPE_NAME,
            };
        },
    },
    Mutation: {
        addCounterState: async (_, { amount }, { cache }) => {
            const {
                counterState: { counter },
            } = cache.readQuery({ query: CounterQueryDocument });
            const newAmount = amount + counter;

            await cache.writeData({
                data: {
                    counterState: {
                        counter: newAmount,
                        __typename: TYPE_NAME,
                    },
                },
            });

            return null;
        },
    },
};

export { defaults, resolvers };
