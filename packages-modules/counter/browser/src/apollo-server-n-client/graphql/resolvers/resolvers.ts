/* eslint-disable import/no-extraneous-dependencies */
import { IClientStateDefault } from '@common-stack/client-core';
import { CounterQueryDocument, CounterStateDocument } from '../../../generated-models';

const TYPE_NAME = 'CounterState';

const stateDefault: IClientStateDefault = {
    type: 'query',
    query: CounterStateDocument,
    data: {
        counterState: {
            counter: 1,
            __typename: TYPE_NAME,
        },
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

export { stateDefault, resolvers };
