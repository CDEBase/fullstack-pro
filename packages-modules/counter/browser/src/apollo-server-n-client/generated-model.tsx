/* tslint:disable */
import { AddCounterStateMutation, AddCounterStateMutationVariables, AddCounterMutation,
AddCounterMutationVariables, CounterStateQuery, CounterStateQueryVariables,CounterQueryQueryVariables,
CounterQueryQuery, OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables,
 } from '../common/generated-models'

import * as SchemaTypes from '../generated-models';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;








export const AddCounterStateDocument = gql`
    mutation addCounterState($amount: Int!) {
  addCounterState(amount: $amount) @client {
    counter
  }
}
    `;
export type AddCounterStateMutationFn = ApolloReactCommon.MutationFunction<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>;
export type AddCounterStateComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>, 'mutation'>;

    export const AddCounterStateComponent = (props: AddCounterStateComponentProps) => (
      <ApolloReactComponents.Mutation<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables> mutation={AddCounterStateDocument} {...props} />
    );
    
export type AddCounterStateProps<TChildProps = {}> = ApolloReactHoc.MutateProps<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables> | TChildProps;
export function withAddCounterState<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SchemaTypes.AddCounterStateMutation,
  SchemaTypes.AddCounterStateMutationVariables,
  AddCounterStateProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables, AddCounterStateProps<TChildProps>>(AddCounterStateDocument, {
      alias: 'addCounterState',
      ...operationOptions
    });
};

/**
 * __useAddCounterStateMutation__
 *
 * To run a mutation, you first call `useAddCounterStateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCounterStateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCounterStateMutation, { data, loading, error }] = useAddCounterStateMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useAddCounterStateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>) {
        return ApolloReactHooks.useMutation<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>(AddCounterStateDocument, baseOptions);
      }
export type AddCounterStateMutationHookResult = ReturnType<typeof useAddCounterStateMutation>;
export type AddCounterStateMutationResult = ApolloReactCommon.MutationResult<SchemaTypes.AddCounterStateMutation>;
export type AddCounterStateMutationOptions = ApolloReactCommon.BaseMutationOptions<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>;
export const AddCounterDocument = gql`
    mutation addCounter($amount: Int!) {
  addCounter(amount: $amount) {
    amount
  }
}
    `;
export type AddCounterMutationFn = ApolloReactCommon.MutationFunction<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>;
export type AddCounterComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>, 'mutation'>;

    export const AddCounterComponent = (props: AddCounterComponentProps) => (
      <ApolloReactComponents.Mutation<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables> mutation={AddCounterDocument} {...props} />
    );
    
export type AddCounterProps<TChildProps = {}> = ApolloReactHoc.MutateProps<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables> | TChildProps;
export function withAddCounter<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SchemaTypes.AddCounterMutation,
  SchemaTypes.AddCounterMutationVariables,
  AddCounterProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables, AddCounterProps<TChildProps>>(AddCounterDocument, {
      alias: 'addCounter',
      ...operationOptions
    });
};

/**
 * __useAddCounterMutation__
 *
 * To run a mutation, you first call `useAddCounterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCounterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCounterMutation, { data, loading, error }] = useAddCounterMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useAddCounterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>) {
        return ApolloReactHooks.useMutation<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>(AddCounterDocument, baseOptions);
      }
export type AddCounterMutationHookResult = ReturnType<typeof useAddCounterMutation>;
export type AddCounterMutationResult = ApolloReactCommon.MutationResult<SchemaTypes.AddCounterMutation>;
export type AddCounterMutationOptions = ApolloReactCommon.BaseMutationOptions<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>;
export const AddCounter_WsDocument = gql`
    mutation AddCounter_WS($amount: Int!) {
  addCounter(amount: $amount) {
    amount
  }
}
    `;
export type AddCounter_WsMutationFn = ApolloReactCommon.MutationFunction<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>;
export type AddCounter_WsComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>, 'mutation'>;

    export const AddCounter_WsComponent = (props: AddCounter_WsComponentProps) => (
      <ApolloReactComponents.Mutation<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables> mutation={AddCounter_WsDocument} {...props} />
    );
    
export type AddCounter_WsProps<TChildProps = {}> = ApolloReactHoc.MutateProps<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables> | TChildProps;
export function withAddCounter_Ws<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SchemaTypes.AddCounter_WsMutation,
  SchemaTypes.AddCounter_WsMutationVariables,
  AddCounter_WsProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables, AddCounter_WsProps<TChildProps>>(AddCounter_WsDocument, {
      alias: 'addCounterWs',
      ...operationOptions
    });
};

/**
 * __useAddCounter_WsMutation__
 *
 * To run a mutation, you first call `useAddCounter_WsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCounter_WsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCounterWsMutation, { data, loading, error }] = useAddCounter_WsMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useAddCounter_WsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>) {
        return ApolloReactHooks.useMutation<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>(AddCounter_WsDocument, baseOptions);
      }
export type AddCounter_WsMutationHookResult = ReturnType<typeof useAddCounter_WsMutation>;
export type AddCounter_WsMutationResult = ApolloReactCommon.MutationResult<SchemaTypes.AddCounter_WsMutation>;
export type AddCounter_WsMutationOptions = ApolloReactCommon.BaseMutationOptions<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>;
export const CounterStateDocument = gql`
    query CounterState {
  counterState @client {
    counter
  }
}
    `;
export type CounterStateComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>, 'query'>;

    export const CounterStateComponent = (props: CounterStateComponentProps) => (
      <ApolloReactComponents.Query<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables> query={CounterStateDocument} {...props} />
    );
    
export type CounterStateProps<TChildProps = {}> = ApolloReactHoc.DataProps<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables> | TChildProps;
export function withCounterState<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SchemaTypes.CounterStateQuery,
  SchemaTypes.CounterStateQueryVariables,
  CounterStateProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables, CounterStateProps<TChildProps>>(CounterStateDocument, {
      alias: 'counterState',
      ...operationOptions
    });
};

/**
 * __useCounterStateQuery__
 *
 * To run a query within a React component, call `useCounterStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useCounterStateQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCounterStateQuery({
 *   variables: {
 *   },
 * });
 */
export function useCounterStateQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>) {
        return ApolloReactHooks.useQuery<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>(CounterStateDocument, baseOptions);
      }
export function useCounterStateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>(CounterStateDocument, baseOptions);
        }
export type CounterStateQueryHookResult = ReturnType<typeof useCounterStateQuery>;
export type CounterStateLazyQueryHookResult = ReturnType<typeof useCounterStateLazyQuery>;
export type CounterStateQueryResult = ApolloReactCommon.QueryResult<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>;
export const CounterQueryDocument = gql`
    query counterQuery {
  counter {
    amount
  }
}
    `;
export type CounterQueryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>, 'query'>;

    export const CounterQueryComponent = (props: CounterQueryComponentProps) => (
      <ApolloReactComponents.Query<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables> query={CounterQueryDocument} {...props} />
    );
    
export type CounterQueryProps<TChildProps = {}> = ApolloReactHoc.DataProps<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables> | TChildProps;
export function withCounterQuery<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SchemaTypes.CounterQueryQuery,
  SchemaTypes.CounterQueryQueryVariables,
  CounterQueryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables, CounterQueryProps<TChildProps>>(CounterQueryDocument, {
      alias: 'counterQuery',
      ...operationOptions
    });
};

/**
 * __useCounterQueryQuery__
 *
 * To run a query within a React component, call `useCounterQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCounterQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCounterQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCounterQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>(CounterQueryDocument, baseOptions);
      }
export function useCounterQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>(CounterQueryDocument, baseOptions);
        }
export type CounterQueryQueryHookResult = ReturnType<typeof useCounterQueryQuery>;
export type CounterQueryLazyQueryHookResult = ReturnType<typeof useCounterQueryLazyQuery>;
export type CounterQueryQueryResult = ApolloReactCommon.QueryResult<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>;
export const OnCounterUpdatedDocument = gql`
    subscription onCounterUpdated {
  counterUpdated {
    amount
  }
}
    `;
export type OnCounterUpdatedComponentProps = Omit<ApolloReactComponents.SubscriptionComponentOptions<SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables>, 'subscription'>;

    export const OnCounterUpdatedComponent = (props: OnCounterUpdatedComponentProps) => (
      <ApolloReactComponents.Subscription<SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables> subscription={OnCounterUpdatedDocument} {...props} />
    );
    
export type OnCounterUpdatedProps<TChildProps = {}> = ApolloReactHoc.DataProps<SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables> | TChildProps;
export function withOnCounterUpdated<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SchemaTypes.OnCounterUpdatedSubscription,
  SchemaTypes.OnCounterUpdatedSubscriptionVariables,
  OnCounterUpdatedProps<TChildProps>>) {
    return ApolloReactHoc.withSubscription<TProps, SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables, OnCounterUpdatedProps<TChildProps>>(OnCounterUpdatedDocument, {
      alias: 'onCounterUpdated',
      ...operationOptions
    });
};

/**
 * __useOnCounterUpdatedSubscription__
 *
 * To run a query within a React component, call `useOnCounterUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnCounterUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnCounterUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnCounterUpdatedSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables>(OnCounterUpdatedDocument, baseOptions);
      }
export type OnCounterUpdatedSubscriptionHookResult = ReturnType<typeof useOnCounterUpdatedSubscription>;
export type OnCounterUpdatedSubscriptionResult = ApolloReactCommon.SubscriptionResult<SchemaTypes.OnCounterUpdatedSubscription>;