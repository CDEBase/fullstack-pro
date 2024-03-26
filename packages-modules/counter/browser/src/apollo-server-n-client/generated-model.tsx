/* tslint:disable */
import * as SchemaTypes from '../generated-models';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client/index.js';
const defaultOptions = {} as const;

export const AddCounterStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addCounterState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCounterState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counter"}}]}}]}}]} as unknown as DocumentNode;

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
export const AddCounterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addCounter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCounter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode;

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
export const AddCounter_WsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCounter_WS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCounter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode;

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
export const SyncCachedCounterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncCachedCounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncCachedCounter"}}]}}]} as unknown as DocumentNode;

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
export const CounterCacheQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"counterCacheQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counterCache"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode;

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
export function useCounterCacheQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>(CounterCacheQueryDocument, options);
        }
export type CounterCacheQueryQueryHookResult = ReturnType<typeof useCounterCacheQueryQuery>;
export type CounterCacheQueryLazyQueryHookResult = ReturnType<typeof useCounterCacheQueryLazyQuery>;
export type CounterCacheQuerySuspenseQueryHookResult = ReturnType<typeof useCounterCacheQuerySuspenseQuery>;
export type CounterCacheQueryQueryResult = Apollo.QueryResult<SchemaTypes.CounterCacheQueryQuery, SchemaTypes.CounterCacheQueryQueryVariables>;
export const CounterStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CounterState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counterState"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counter"}}]}}]}}]} as unknown as DocumentNode;

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
export function useCounterStateSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>(CounterStateDocument, options);
        }
export type CounterStateQueryHookResult = ReturnType<typeof useCounterStateQuery>;
export type CounterStateLazyQueryHookResult = ReturnType<typeof useCounterStateLazyQuery>;
export type CounterStateSuspenseQueryHookResult = ReturnType<typeof useCounterStateSuspenseQuery>;
export type CounterStateQueryResult = Apollo.QueryResult<SchemaTypes.CounterStateQuery, SchemaTypes.CounterStateQueryVariables>;
export const CounterQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"counterQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode;

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
export function useCounterQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>(CounterQueryDocument, options);
        }
export type CounterQueryQueryHookResult = ReturnType<typeof useCounterQueryQuery>;
export type CounterQueryLazyQueryHookResult = ReturnType<typeof useCounterQueryLazyQuery>;
export type CounterQuerySuspenseQueryHookResult = ReturnType<typeof useCounterQuerySuspenseQuery>;
export type CounterQueryQueryResult = Apollo.QueryResult<SchemaTypes.CounterQueryQuery, SchemaTypes.CounterQueryQueryVariables>;
export const OnCounterUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onCounterUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counterUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode;

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