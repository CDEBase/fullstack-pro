/* tslint:disable */
import { AddCounterStateMutation, AddCounterStateMutationVariables, AddCounterMutation,
AddCounterMutationVariables, CounterStateQuery, CounterStateQueryVariables,CounterQueryQueryVariables,
CounterQueryQuery, OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables,
 } from '../common/generated-models'

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export const AddCounterStateDocument = gql`
    mutation addCounterState($amount: Int!) {
  addCounterState(amount: $amount) @client {
    counter
  }
}
    `;
export type AddCounterStateMutationFn = ApolloReactCommon.MutationFunction<AddCounterStateMutation, AddCounterStateMutationVariables>;
export type AddCounterStateComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<AddCounterStateMutation, AddCounterStateMutationVariables>, 'mutation'>;

    export const AddCounterStateComponent = (props: AddCounterStateComponentProps) => (
      <ApolloReactComponents.Mutation<AddCounterStateMutation, AddCounterStateMutationVariables> mutation={AddCounterStateDocument} {...props} />
    );
    
export type AddCounterStateProps<TChildProps = {}> = ApolloReactHoc.MutateProps<AddCounterStateMutation, AddCounterStateMutationVariables> & TChildProps;
export function withAddCounterState<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  AddCounterStateMutation,
  AddCounterStateMutationVariables,
  AddCounterStateProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, AddCounterStateMutation, AddCounterStateMutationVariables, AddCounterStateProps<TChildProps>>(AddCounterStateDocument, {
      alias: 'addCounterState',
      ...operationOptions
    });
};
export type AddCounterStateMutationResult = ApolloReactCommon.MutationResult<AddCounterStateMutation>;
export type AddCounterStateMutationOptions = ApolloReactCommon.BaseMutationOptions<AddCounterStateMutation, AddCounterStateMutationVariables>;
export const AddCounterDocument = gql`
    mutation addCounter($amount: Int!) {
  addCounter(amount: $amount) {
    amount
  }
}
    `;
export type AddCounterMutationFn = ApolloReactCommon.MutationFunction<AddCounterMutation, AddCounterMutationVariables>;
export type AddCounterComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<AddCounterMutation, AddCounterMutationVariables>, 'mutation'>;

    export const AddCounterComponent = (props: AddCounterComponentProps) => (
      <ApolloReactComponents.Mutation<AddCounterMutation, AddCounterMutationVariables> mutation={AddCounterDocument} {...props} />
    );
    
export type AddCounterProps<TChildProps = {}> = ApolloReactHoc.MutateProps<AddCounterMutation, AddCounterMutationVariables> & TChildProps;
export function withAddCounter<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  AddCounterMutation,
  AddCounterMutationVariables,
  AddCounterProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, AddCounterMutation, AddCounterMutationVariables, AddCounterProps<TChildProps>>(AddCounterDocument, {
      alias: 'addCounter',
      ...operationOptions
    });
};
export type AddCounterMutationResult = ApolloReactCommon.MutationResult<AddCounterMutation>;
export type AddCounterMutationOptions = ApolloReactCommon.BaseMutationOptions<AddCounterMutation, AddCounterMutationVariables>;
export const CounterStateDocument = gql`
    query CounterState {
  counterState @client {
    counter
  }
}
    `;
export type CounterStateComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<CounterStateQuery, CounterStateQueryVariables>, 'query'>;

    export const CounterStateComponent = (props: CounterStateComponentProps) => (
      <ApolloReactComponents.Query<CounterStateQuery, CounterStateQueryVariables> query={CounterStateDocument} {...props} />
    );
    
export type CounterStateProps<TChildProps = {}> = ApolloReactHoc.DataProps<CounterStateQuery, CounterStateQueryVariables> & TChildProps;
export function withCounterState<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  CounterStateQuery,
  CounterStateQueryVariables,
  CounterStateProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, CounterStateQuery, CounterStateQueryVariables, CounterStateProps<TChildProps>>(CounterStateDocument, {
      alias: 'counterState',
      ...operationOptions
    });
};
export type CounterStateQueryResult = ApolloReactCommon.QueryResult<CounterStateQuery, CounterStateQueryVariables>;
export const CounterQueryDocument = gql`
    query counterQuery {
  counter {
    amount
  }
}
    `;
export type CounterQueryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<CounterQueryQuery, CounterQueryQueryVariables>, 'query'>;

    export const CounterQueryComponent = (props: CounterQueryComponentProps) => (
      <ApolloReactComponents.Query<CounterQueryQuery, CounterQueryQueryVariables> query={CounterQueryDocument} {...props} />
    );
    
export type CounterQueryProps<TChildProps = {}> = ApolloReactHoc.DataProps<CounterQueryQuery, CounterQueryQueryVariables> & TChildProps;
export function withCounterQuery<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  CounterQueryQuery,
  CounterQueryQueryVariables,
  CounterQueryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, CounterQueryQuery, CounterQueryQueryVariables, CounterQueryProps<TChildProps>>(CounterQueryDocument, {
      alias: 'counterQuery',
      ...operationOptions
    });
};
export type CounterQueryQueryResult = ApolloReactCommon.QueryResult<CounterQueryQuery, CounterQueryQueryVariables>;
export const OnCounterUpdatedDocument = gql`
    subscription onCounterUpdated {
  counterUpdated {
    amount
  }
}
    `;
export type OnCounterUpdatedComponentProps = Omit<ApolloReactComponents.SubscriptionComponentOptions<OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables>, 'subscription'>;

    export const OnCounterUpdatedComponent = (props: OnCounterUpdatedComponentProps) => (
      <ApolloReactComponents.Subscription<OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables> subscription={OnCounterUpdatedDocument} {...props} />
    );
    
export type OnCounterUpdatedProps<TChildProps = {}> = ApolloReactHoc.DataProps<OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables> & TChildProps;
export function withOnCounterUpdated<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  OnCounterUpdatedSubscription,
  OnCounterUpdatedSubscriptionVariables,
  OnCounterUpdatedProps<TChildProps>>) {
    return ApolloReactHoc.withSubscription<TProps, OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables, OnCounterUpdatedProps<TChildProps>>(OnCounterUpdatedDocument, {
      alias: 'onCounterUpdated',
      ...operationOptions
    });
};
export type OnCounterUpdatedSubscriptionResult = ApolloReactCommon.SubscriptionResult<OnCounterUpdatedSubscription>;