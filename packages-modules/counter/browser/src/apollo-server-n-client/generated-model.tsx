/* tslint:disable */
import * as SchemaTypes from '../generated-models';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/client/react/components';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const defaultOptions =  {}

export const AddCounterStateDocument = gql`
    mutation addCounterState($amount: Int!) {
  addCounterState(amount: $amount) @client {
    counter
  }
}
    `;
export type AddCounterStateMutationFn = Apollo.MutationFunction<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>;
export type AddCounterStateComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>, 'mutation'>;

    export const AddCounterStateComponent = (props: AddCounterStateComponentProps) => (
      <ApolloReactComponents.Mutation<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables> mutation={AddCounterStateDocument} {...props} />
    );
    

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
export function useAddCounterStateMutation(baseOptions?: Apollo.MutationHookOptions<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>(AddCounterStateDocument, options);
      }
export type AddCounterStateMutationHookResult = ReturnType<typeof useAddCounterStateMutation>;
export type AddCounterStateMutationResult = Apollo.MutationResult<SchemaTypes.AddCounterStateMutation>;
export type AddCounterStateMutationOptions = Apollo.BaseMutationOptions<SchemaTypes.AddCounterStateMutation, SchemaTypes.AddCounterStateMutationVariables>;
export const AddCounterDocument = gql`
    mutation addCounter($amount: Int!) {
  addCounter(amount: $amount) {
    amount
  }
}
    `;
export type AddCounterMutationFn = Apollo.MutationFunction<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>;
export type AddCounterComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>, 'mutation'>;

    export const AddCounterComponent = (props: AddCounterComponentProps) => (
      <ApolloReactComponents.Mutation<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables> mutation={AddCounterDocument} {...props} />
    );
    

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
export function useAddCounterMutation(baseOptions?: Apollo.MutationHookOptions<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>(AddCounterDocument, options);
      }
export type AddCounterMutationHookResult = ReturnType<typeof useAddCounterMutation>;
export type AddCounterMutationResult = Apollo.MutationResult<SchemaTypes.AddCounterMutation>;
export type AddCounterMutationOptions = Apollo.BaseMutationOptions<SchemaTypes.AddCounterMutation, SchemaTypes.AddCounterMutationVariables>;
export const AddCounter_WsDocument = gql`
    mutation AddCounter_WS($amount: Int!) {
  addCounter(amount: $amount) {
    amount
  }
}
    `;
export type AddCounter_WsMutationFn = Apollo.MutationFunction<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>;
export type AddCounter_WsComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>, 'mutation'>;

    export const AddCounter_WsComponent = (props: AddCounter_WsComponentProps) => (
      <ApolloReactComponents.Mutation<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables> mutation={AddCounter_WsDocument} {...props} />
    );
    

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
export function useAddCounter_WsMutation(baseOptions?: Apollo.MutationHookOptions<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>(AddCounter_WsDocument, options);
      }
export type AddCounter_WsMutationHookResult = ReturnType<typeof useAddCounter_WsMutation>;
export type AddCounter_WsMutationResult = Apollo.MutationResult<SchemaTypes.AddCounter_WsMutation>;
export type AddCounter_WsMutationOptions = Apollo.BaseMutationOptions<SchemaTypes.AddCounter_WsMutation, SchemaTypes.AddCounter_WsMutationVariables>;
export const SyncCachedCounterDocument = gql`
    mutation SyncCachedCounter {
  syncCachedCounter
}
    `;
export type SyncCachedCounterMutationFn = Apollo.MutationFunction<SchemaTypes.SyncCachedCounterMutation, SchemaTypes.SyncCachedCounterMutationVariables>;
export type SyncCachedCounterComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SchemaTypes.SyncCachedCounterMutation, SchemaTypes.SyncCachedCounterMutationVariables>, 'mutation'>;

    export const SyncCachedCounterComponent = (props: SyncCachedCounterComponentProps) => (
      <ApolloReactComponents.Mutation<SchemaTypes.SyncCachedCounterMutation, SchemaTypes.SyncCachedCounterMutationVariables> mutation={SyncCachedCounterDocument} {...props} />
    );
    

/**
 * __useSyncCachedCounterMutation__
 *
 * To run a mutation, you first call `useSyncCachedCounterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncCachedCounterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncCachedCounterMutation, { data, loading, error }] = useSyncCachedCounterMutation({
 *   variables: {
 *   },
 * });
 */
export function useSyncCachedCounterMutation(baseOptions?: Apollo.MutationHookOptions<SchemaTypes.SyncCachedCounterMutation, SchemaTypes.SyncCachedCounterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SchemaTypes.SyncCachedCounterMutation, SchemaTypes.SyncCachedCounterMutationVariables>(SyncCachedCounterDocument, options);
      }
export type SyncCachedCounterMutationHookResult = ReturnType<typeof useSyncCachedCounterMutation>;
export type SyncCachedCounterMutationResult = Apollo.MutationResult<SchemaTypes.SyncCachedCounterMutation>;
export type SyncCachedCounterMutationOptions = Apollo.BaseMutationOptions<SchemaTypes.SyncCachedCounterMutation, SchemaTypes.SyncCachedCounterMutationVariables>;
export const CounterCacheQueryDocument = gql`
    query counterCacheQuery {
  counterCache {
    amount
  }
}
    `;
export type CounterCacheQueryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>, 'query'>;

    export const CounterCacheQueryComponent = (props: CounterCacheQueryComponentProps) => (
      <ApolloReactComponents.Query<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables> query={CounterCacheQueryDocument} {...props} />
    );
    

/**
 * __useCounterCacheQueryQuery__
 *
 * To run a query within a React component, call `useCounterCacheQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCounterCacheQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCounterCacheQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCounterCacheQueryQuery(baseOptions?: Apollo.QueryHookOptions<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>(CounterCacheQueryDocument, options);
      }
export function useCounterCacheQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>(CounterCacheQueryDocument, options);
        }
export type CounterCacheQueryQueryHookResult = ReturnType<typeof useCounterCacheQueryQuery>;
export type CounterCacheQueryLazyQueryHookResult = ReturnType<typeof useCounterCacheQueryLazyQuery>;
export type CounterCacheQueryQueryResult = Apollo.QueryResult<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>;
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
export function useCounterStateQuery(baseOptions?: Apollo.QueryHookOptions<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>(CounterStateDocument, options);
      }
export function useCounterStateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>(CounterStateDocument, options);
        }
export type CounterStateQueryHookResult = ReturnType<typeof useCounterStateQuery>;
export type CounterStateLazyQueryHookResult = ReturnType<typeof useCounterStateLazyQuery>;
export type CounterStateQueryResult = Apollo.QueryResult<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>;
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
export function useCounterQueryQuery(baseOptions?: Apollo.QueryHookOptions<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>(CounterQueryDocument, options);
      }
export function useCounterQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>(CounterQueryDocument, options);
        }
export type CounterQueryQueryHookResult = ReturnType<typeof useCounterQueryQuery>;
export type CounterQueryLazyQueryHookResult = ReturnType<typeof useCounterQueryLazyQuery>;
export type CounterQueryQueryResult = Apollo.QueryResult<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>;
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
export function useOnCounterUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SchemaTypes.OnCounterUpdatedSubscription, SchemaTypes.OnCounterUpdatedSubscriptionVariables>(OnCounterUpdatedDocument, options);
      }
export type OnCounterUpdatedSubscriptionHookResult = ReturnType<typeof useOnCounterUpdatedSubscription>;
export type OnCounterUpdatedSubscriptionResult = Apollo.SubscriptionResult<SchemaTypes.OnCounterUpdatedSubscription>;