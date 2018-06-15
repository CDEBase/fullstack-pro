import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import { connect, Store } from 'react-redux';
import CounterView from '../components/CounterView';
import {
  COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION, COUNTER_QUERY_CLIENT, ADD_COUNTER_CLIENT,
} from '../graphql';

class Counter extends React.Component<any, any> {
  private subscription;

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  public componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  public subscribeToCount() {
    const { subscribeToMore } = this.props;
    this.subscription = subscribeToMore({
      document: COUNTER_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, { subscriptionData: { data: { counterUpdated: { amount } } } }) => {
        return update(prev, {
          counter: {
            amount: {
              $set: amount,
            },
          },
        });
      },
    });
  }

  public render() {
    return <CounterView {...this.props} />;
  }
}

const CounterWithApollo: any = compose(
  graphql(COUNTER_QUERY, {
    props({ data: { loading, error, counter, subscribeToMore } }: any) {
      if (error) { throw new Error(error); }
      return { loading, counter, subscribeToMore };
    },
  }),
  graphql(ADD_COUNTER, {
    props: ({ ownProps, mutate }: any) => ({
      addCounter(amount) {
        return () =>
          mutate({
            variables: { amount },
            updateQueries: {
              counterQuery: (prev, { mutationResult }) => {
                const newAmount = mutationResult.data.addCounter.amount;
                return update(prev, {
                  counter: {
                    amount: {
                      $set: newAmount,
                    },
                  },
                });
              },
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addCounter: {
                __typename: 'Counter',
                amount: ownProps.counter.amount + 1,
              },
            },
          });
      },
    }),
  }),
  graphql(ADD_COUNTER_CLIENT, {
    props: ({ mutate }) => ({
      addCounterState: amount => () => {
        const { value }: any = mutate({ variables: { amount } });
        return value;
      },
    }),
  }),
  graphql(COUNTER_QUERY_CLIENT, {
    props: ({ data: { counterState: { counter } } }: any) => ({ counterState: counter }),
  }),
)(Counter);

export default connect(
  state => ({ reduxCount: (state as any).counter.reduxCount }),
  dispatch => ({
    onReduxIncrement(value) {
      return () =>
        dispatch({
          type: 'COUNTER_INCREMENT',
          value: Number(value),
        });
    },
  }),
)(CounterWithApollo);
