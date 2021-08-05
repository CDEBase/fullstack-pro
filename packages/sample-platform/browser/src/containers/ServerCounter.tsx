import * as React from 'react';
import update from 'immutability-helper';
import { graphql } from '@apollo/react-hoc';
import compose from 'lodash/flowRight';
import { CounterComponent, ICounterProps } from '../components';
import { COUNT_SUBSCRIPTION, COUNT_QUERY, ADD_COUNT_MUTATION,} from '../graphql';
import { logger } from '@cdm-logger/client';
type SubscriptionProps = {
    subscribeToMore: Function;
};

// class WithSubscriptionCounter extends React.Component<SubscriptionProps & ICounterProps, {}> {

//     public subscription;

//     constructor(props) {
//         super(props);
//     }

//     public componentWillReceiveProps(nextProps) {
//         if (!nextProps.loading) {
//             if (this.subscription) {
//                 this.subscription();
//                 this.subscription = null;
//             }

//             // Subscribe or re-subscribe
//             if (!this.subscription) {
//                 this.subscribeToCount();
//             }
//         }
//     }

//     public componentWillUnmount() {
//         if (this.subscription) {
//             this.subscription();
//         }
//     }

//     private subscribeToCount() {
//         const { subscribeToMore } = this.props;
//         this.subscription = subscribeToMore({
//             document: onCountUpdated,
//             variables: {},
//             updateQuery: (prev, { subscriptionData: { data: { countUpdated: { amount } } } }) => {
//                 return update(prev, {
//                     count: {
//                         amount: {
//                             $set: amount,
//                         },
//                     },
//                 });
//             },
//         });
//     }

//     public render() {
//         const { ICounerProps } = this.props;
//         return <CounterComponent />;
//     }
// }


// save(amount) {
//     return () => mutate({
//         variables: { amount },
//         updateQueries,
//     });
// },

type countOptions = any & {
    countData: any;
};

const updateQueries = {
    counter: (prev, { mutationResult }) => {
        const newAmount = mutationResult.data.addCount.amount;
        return update(prev, {
            count: {
                amount: {
                    $set: newAmount,
                },
            },
        });
    },
};

export const CounterWithApollo: React.ComponentClass = (compose(
    graphql<{}, any, {}, {}>(ADD_COUNT_MUTATION, {
        props: ({ ownProps, mutate }) => ({
            save: (amount) => {
                return () => mutate({
                    variables: { amount },
                    // optimisticResponse: {
                    //     __typename: 'Mutation',

                    // },
                });
            },
        }),
    }),
    graphql<{}, any, {}, {}>(ADD_COUNT_MUTATION, {
        props: ({ ownProps, mutate }) => ({
            increment: (amount) => {
                return () => mutate({
                    variables: { amount },
                    // updateQueries,
                });
            },
        }),
    }),
)(graphql<ICounterProps, countOptions, {}, {}>(COUNT_QUERY, {
    name: 'countData',
    props: ({ countData }: any) => {
        const newlog = logger.child({ childName: 'UIController' });
        newlog.debug('count data : (%j)', countData);
        return {
            subscribeToCount: params => {
                // logger.debug('count subscript data (%j)', params);
                return countData.subscribeToMore({
                    document: COUNT_SUBSCRIPTION,
                    variables: {},
                    updateQuery: (prev: any, { subscriptionData }) => {
                        const payload = subscriptionData.data && subscriptionData.data.subscribeToWorkspace;
                        if (!payload) {
                            return prev;
                        }
                        return payload;
                    },
                });
            },
            counter: countData.count && countData.count.amount,
            isLoading: countData.loading,
            isSaving: false,
            load: () => countData.count.amount,
            error: countData.error,
        };
    },
})(CounterComponent as any))
);
