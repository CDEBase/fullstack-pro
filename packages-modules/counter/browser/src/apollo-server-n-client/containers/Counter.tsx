import * as React from 'react';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import compose from 'lodash/flowRight';
import { connect } from 'react-redux';
import CounterView from '../components/CounterView';
import {
  CounterQueryDocument, AddCounterDocument, OnCounterUpdatedDocument,
  AddCounterStateDocument, CounterStateDocument,
} from '../../common/generated-models';
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
      document: OnCounterUpdatedDocument,
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
  graphql(CounterQueryDocument, {
    props({ data: { loading, error, counter, subscribeToMore } }: any) {
      if (error) { throw new Error(error); }
      return { loading, counter, subscribeToMore };
    },
  }),
  graphql(AddCounterDocument, {
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
  } as any),
  graphql(AddCounterStateDocument, {
    props: ({ mutate }) => ({
      addCounterState: amount => () => {
        const { value }: any = mutate({ variables: { amount } });
        return value;
      },
    } as any),
  }),
  graphql(CounterStateDocument, {
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
