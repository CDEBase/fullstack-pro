/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { IClientStateDefault } from '@common-stack/client-core';
import { InMemoryCache } from '@apollo/client/cache';
import { CounterStateDocument } from '../../../generated-models';

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
            } = cache.readQuery({ query: CounterStateDocument });
            return {
                counter,
                __typename: TYPE_NAME,
            };
        },
    },
    Mutation: {
        addCounterState: async (_, { amount }, { cache }: { cache: InMemoryCache }) => {
            const {
                counterState: { counter },
            } = cache.readQuery({ query: CounterStateDocument });
            const newAmount = amount + counter;

            await cache.writeQuery({
                query: CounterStateDocument,
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
