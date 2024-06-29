/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';
import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client/index.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ClientCounter = {
  __typename?: 'ClientCounter';
  counter?: Maybe<Scalars['Int']['output']>;
};

/**  Database counter  */
export type Counter = {
  __typename?: 'Counter';
  /**  Current amount  */
  amount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**  Increase counter value returns current counter amount  */
  addCounter?: Maybe<Counter>;
  addCounterState?: Maybe<ClientCounter>;
  /**  add Counter  */
  addMoleculerCounter?: Maybe<Counter>;
  /**  sync cached counter with current value  */
  syncCachedCounter?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAddCounterArgs = {
  amount?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationAddCounterStateArgs = {
  amount: Scalars['Int']['input'];
};


export type MutationAddMoleculerCounterArgs = {
  amount?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  /**  Counter  */
  counter?: Maybe<Counter>;
  /**  Counter from Datasource  */
  counterCache?: Maybe<Counter>;
  counterState?: Maybe<ClientCounter>;
  /**  Moleculer Counter  */
  moleculerCounter?: Maybe<Counter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /**  Subscription fired when anyone increases counter  */
  counterUpdated?: Maybe<Counter>;
  moleculerCounterUpdate?: Maybe<Counter>;
};

export type AddCounterStateMutationVariables = Exact<{
  amount: Scalars['Int']['input'];
}>;


export type AddCounterStateMutation = { __typename?: 'Mutation', addCounterState?: { __typename?: 'ClientCounter', counter?: number | null } | null };

export type AddCounterMutationVariables = Exact<{
  amount: Scalars['Int']['input'];
}>;


export type AddCounterMutation = { __typename?: 'Mutation', addCounter?: { __typename?: 'Counter', amount: number } | null };

export type AddCounter_WsMutationVariables = Exact<{
  amount: Scalars['Int']['input'];
}>;


export type AddCounter_WsMutation = { __typename?: 'Mutation', addCounter?: { __typename?: 'Counter', amount: number } | null };

export type SyncCachedCounterMutationVariables = Exact<{ [key: string]: never; }>;


export type SyncCachedCounterMutation = { __typename?: 'Mutation', syncCachedCounter?: boolean | null };

export type CounterCacheQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CounterCacheQueryQuery = { __typename?: 'Query', counterCache?: { __typename?: 'Counter', amount: number } | null };

export type CounterStateQueryVariables = Exact<{ [key: string]: never; }>;


export type CounterStateQuery = { __typename?: 'Query', counterState?: { __typename?: 'ClientCounter', counter?: number | null } | null };

export type CounterQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CounterQueryQuery = { __typename?: 'Query', counter?: { __typename?: 'Counter', amount: number } | null };

export type OnCounterUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCounterUpdatedSubscription = { __typename?: 'Subscription', counterUpdated?: { __typename?: 'Counter', amount: number } | null };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ClientCounter: ResolverTypeWrapper<ClientCounter>;
  Counter: ResolverTypeWrapper<Counter>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  ClientCounter: ClientCounter;
  Counter: Counter;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
};

export type ClientCounterResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClientCounter'] = ResolversParentTypes['ClientCounter']> = {
  counter?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CounterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Counter'] = ResolversParentTypes['Counter']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCounter?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType, Partial<MutationAddCounterArgs>>;
  addCounterState?: Resolver<Maybe<ResolversTypes['ClientCounter']>, ParentType, ContextType, RequireFields<MutationAddCounterStateArgs, 'amount'>>;
  addMoleculerCounter?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType, Partial<MutationAddMoleculerCounterArgs>>;
  syncCachedCounter?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  counter?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType>;
  counterCache?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType>;
  counterState?: Resolver<Maybe<ResolversTypes['ClientCounter']>, ParentType, ContextType>;
  moleculerCounter?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  counterUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Counter']>, "counterUpdated", ParentType, ContextType>;
  moleculerCounterUpdate?: SubscriptionResolver<Maybe<ResolversTypes['Counter']>, "moleculerCounterUpdate", ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ClientCounter?: ClientCounterResolvers<ContextType>;
  Counter?: CounterResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
};



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
export function useAddCounterStateMutation(baseOptions?: Apollo.MutationHookOptions<AddCounterStateMutation, AddCounterStateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCounterStateMutation, AddCounterStateMutationVariables>(AddCounterStateDocument, options);
      }
export type AddCounterStateMutationHookResult = ReturnType<typeof useAddCounterStateMutation>;
export type AddCounterStateMutationResult = Apollo.MutationResult<AddCounterStateMutation>;
export type AddCounterStateMutationOptions = Apollo.BaseMutationOptions<AddCounterStateMutation, AddCounterStateMutationVariables>;
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
export function useAddCounterMutation(baseOptions?: Apollo.MutationHookOptions<AddCounterMutation, AddCounterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCounterMutation, AddCounterMutationVariables>(AddCounterDocument, options);
      }
export type AddCounterMutationHookResult = ReturnType<typeof useAddCounterMutation>;
export type AddCounterMutationResult = Apollo.MutationResult<AddCounterMutation>;
export type AddCounterMutationOptions = Apollo.BaseMutationOptions<AddCounterMutation, AddCounterMutationVariables>;
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
export function useAddCounter_WsMutation(baseOptions?: Apollo.MutationHookOptions<AddCounter_WsMutation, AddCounter_WsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCounter_WsMutation, AddCounter_WsMutationVariables>(AddCounter_WsDocument, options);
      }
export type AddCounter_WsMutationHookResult = ReturnType<typeof useAddCounter_WsMutation>;
export type AddCounter_WsMutationResult = Apollo.MutationResult<AddCounter_WsMutation>;
export type AddCounter_WsMutationOptions = Apollo.BaseMutationOptions<AddCounter_WsMutation, AddCounter_WsMutationVariables>;
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
export function useSyncCachedCounterMutation(baseOptions?: Apollo.MutationHookOptions<SyncCachedCounterMutation, SyncCachedCounterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncCachedCounterMutation, SyncCachedCounterMutationVariables>(SyncCachedCounterDocument, options);
      }
export type SyncCachedCounterMutationHookResult = ReturnType<typeof useSyncCachedCounterMutation>;
export type SyncCachedCounterMutationResult = Apollo.MutationResult<SyncCachedCounterMutation>;
export type SyncCachedCounterMutationOptions = Apollo.BaseMutationOptions<SyncCachedCounterMutation, SyncCachedCounterMutationVariables>;
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
export function useCounterCacheQueryQuery(baseOptions?: Apollo.QueryHookOptions<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>(CounterCacheQueryDocument, options);
      }
export function useCounterCacheQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>(CounterCacheQueryDocument, options);
        }
export function useCounterCacheQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>(CounterCacheQueryDocument, options);
        }
export type CounterCacheQueryQueryHookResult = ReturnType<typeof useCounterCacheQueryQuery>;
export type CounterCacheQueryLazyQueryHookResult = ReturnType<typeof useCounterCacheQueryLazyQuery>;
export type CounterCacheQuerySuspenseQueryHookResult = ReturnType<typeof useCounterCacheQuerySuspenseQuery>;
export type CounterCacheQueryQueryResult = Apollo.QueryResult<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>;
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
export function useCounterStateQuery(baseOptions?: Apollo.QueryHookOptions<CounterStateQuery, CounterStateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CounterStateQuery, CounterStateQueryVariables>(CounterStateDocument, options);
      }
export function useCounterStateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CounterStateQuery, CounterStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CounterStateQuery, CounterStateQueryVariables>(CounterStateDocument, options);
        }
export function useCounterStateSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CounterStateQuery, CounterStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CounterStateQuery, CounterStateQueryVariables>(CounterStateDocument, options);
        }
export type CounterStateQueryHookResult = ReturnType<typeof useCounterStateQuery>;
export type CounterStateLazyQueryHookResult = ReturnType<typeof useCounterStateLazyQuery>;
export type CounterStateSuspenseQueryHookResult = ReturnType<typeof useCounterStateSuspenseQuery>;
export type CounterStateQueryResult = Apollo.QueryResult<CounterStateQuery, CounterStateQueryVariables>;
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
export function useCounterQueryQuery(baseOptions?: Apollo.QueryHookOptions<CounterQueryQuery, CounterQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CounterQueryQuery, CounterQueryQueryVariables>(CounterQueryDocument, options);
      }
export function useCounterQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CounterQueryQuery, CounterQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CounterQueryQuery, CounterQueryQueryVariables>(CounterQueryDocument, options);
        }
export function useCounterQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CounterQueryQuery, CounterQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CounterQueryQuery, CounterQueryQueryVariables>(CounterQueryDocument, options);
        }
export type CounterQueryQueryHookResult = ReturnType<typeof useCounterQueryQuery>;
export type CounterQueryLazyQueryHookResult = ReturnType<typeof useCounterQueryLazyQuery>;
export type CounterQuerySuspenseQueryHookResult = ReturnType<typeof useCounterQuerySuspenseQuery>;
export type CounterQueryQueryResult = Apollo.QueryResult<CounterQueryQuery, CounterQueryQueryVariables>;
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
export function useOnCounterUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables>(OnCounterUpdatedDocument, options);
      }
export type OnCounterUpdatedSubscriptionHookResult = ReturnType<typeof useOnCounterUpdatedSubscription>;
export type OnCounterUpdatedSubscriptionResult = Apollo.SubscriptionResult<OnCounterUpdatedSubscription>;