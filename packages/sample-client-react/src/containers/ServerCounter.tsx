import * as React from 'react';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { CounterComponent, ICounterProps } from '../components';
import { COUNT_SUBSCRIPTION, COUNT_QUERY, GetCountQuery, AddCountMutation, ADD_COUNT_MUTATION } from '@sample/graphql';

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

export const CounterWithApollo = compose(
    graphql<GetCountQuery>(COUNT_QUERY, {
        props({ data: { loading, count, subscribeToMore } }) {
            return { isLoading: loading, counter: count && count.amount, subscribeToMore };
        },
    }),
    graphql<AddCountMutation>(ADD_COUNT_MUTATION, {
        props: ({ ownProps, mutate }) => ({
            increment(amount) {
                return () => mutate({
                    variables: { amount },
                    updateQueries,
                });
            },
            save(amount) {
                return () => mutate({
                    variables: { amount },
                    updateQueries,
                });
            },
        }),
    }),
)(CounterComponent);
