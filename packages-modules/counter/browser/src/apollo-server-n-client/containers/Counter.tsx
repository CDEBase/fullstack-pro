/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect } from 'react';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import CounterView from '../components/CounterView';
import {
    useCounterQueryQuery,
    useAddCounterMutation,
    useAddCounterStateMutation,
    useCounterStateQuery,
    useAddCounter_WsMutation, 
    useSyncCachedCounterMutation, 
    useCounterCacheQueryLazyQuery
} from '../generated-model';
import {
    OnCounterUpdatedDocument,
} from '../../common/generated-models';

/**
 * 
 * @description Counter Component with Data dependency.
 */
const CounterWithApollo: React.SFC<any> = (props) => {
    const [addCounterMutation] = useAddCounterMutation();
    const { loading, error, data: counterData, subscribeToMore, } = useCounterQueryQuery();
    const [addCounterStateMutation] = useAddCounterStateMutation();
    const { data: couterStateData } = useCounterStateQuery();
    const dispatch = useDispatch();
    const reduxCount = useSelector(state => (state as any).counter.reduxCount);
    const [getCounter, { loading: getCounterLoading, data: cachedData }] = useCounterCacheQueryLazyQuery({ fetchPolicy: 'network-only' });
    const [addCounterWs] = useAddCounter_WsMutation();
    const [syncCachedCounter] = useSyncCachedCounterMutation();

    useEffect(() => {
        const unsubscribe = subscribeToMore(getSubscriptionOptions({}));
        return () => unsubscribe();
    }, [subscribeToMore]);

    const onReduxIncrement = (value) => () => {
        dispatch({
            type: 'COUNTER_INCREMENT',
            value: Number(value),
        });
    }
    const addCounter = (amount) => () => {
        addCounterMutation({
            variables: { amount },
            // Update the Cache of the Query that need to be display when it's dependent mutation gets called.
            // This is needed for two reasons
            // a). When update the Optimistically update cache, this get executes
            // b). When the mutation response from Server, this gets update.
            // Note: Optimistically update wont' work when network is offline.
            update: (cache, { data: { addCounter } }) => {
                // update the query's cache manually
                // recommend to be done using fields but it can be done directly updating the cache
                cache.modify({
                    fields: {
                        counter(prev) {
                            return { amount: addCounter.amount };
                        }
                    }
                })
            },
            // Optimistically update the amount to the locally cached
            // before the server responds
            // You can verify it by setting the "Network conditions" in devtools to `Slow 3G`.
            // You will see the data gets updated before the server responds.
            optimisticResponse: {
                // __typename: 'Mutation',
                addCounter: {
                    __typename: 'Counter',
                    amount: counterData?.counter.amount + amount,
                }
            }
        })
    }

    const addCounterState = (amount) => () => {
        addCounterStateMutation({
            variables: { amount }
        });
    }
    const getSubscriptionOptions = ({ }) => {
        return {
            document: OnCounterUpdatedDocument,
            variables: {},
            updateQuery: (prev,
                {
                    subscriptionData: {
                        data: {
                            counterUpdated: { amount },
                        },
                    }
                }) => {
                return update(prev, {
                    counter: {
                        amount: {
                            $set: amount,
                        },
                    },
                });
            }
        }
    }

    return <CounterView
        loading={loading}
        counter={counterData?.counter}
        counterState={couterStateData?.counterState?.counter}
        addCounter={addCounter}
        addCounterState={addCounterState}
        reduxCount={reduxCount}
        onReduxIncrement={onReduxIncrement}
        getCounterLoading={getCounterLoading}
        addCounterWs={addCounterWs}
        getCounter={getCounter}
        syncCachedCounter={syncCachedCounter}
        cachedData={cachedData}
    />
}

export default CounterWithApollo;