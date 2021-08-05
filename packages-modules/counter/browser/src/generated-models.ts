/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* tslint:disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
    { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    AnyObject: any;
    JSON: any;
    JSONObject: any;
};

export type ClientCounter = {
    __typename?: 'ClientCounter';
    counter?: Maybe<Scalars['Int']>;
};

/**  Database counter  */
export type Counter = {
    __typename?: 'Counter';
    /**  Current amount  */
    amount: Scalars['Int'];
};

export type FieldError = {
    __typename?: 'FieldError';
    field: Scalars['String'];
    message: Scalars['String'];
};

export type Mutation = {
    __typename?: 'Mutation';
    /**  Increase counter value returns current counter amount  */
    addCounter?: Maybe<Counter>;
    addCounterState?: Maybe<ClientCounter>;
    /**  add Counter  */
    addMoleculerCounter?: Maybe<Counter>;
    dummy?: Maybe<Scalars['Int']>;
    /**  sync cached counter with current value  */
    syncCachedCounter?: Maybe<Scalars['Boolean']>;
};

export type MutationAddCounterArgs = {
    amount?: Maybe<Scalars['Int']>;
};

export type MutationAddCounterStateArgs = {
    amount: Scalars['Int'];
};

export type MutationAddMoleculerCounterArgs = {
    amount?: Maybe<Scalars['Int']>;
};

export type Node = {
    id: Scalars['ID'];
};

export type Query = {
    __typename?: 'Query';
    /**  Counter  */
    counter?: Maybe<Counter>;
    /**  Counter from Datasource  */
    counterCache?: Maybe<Counter>;
    counterState?: Maybe<ClientCounter>;
    dummy?: Maybe<Scalars['Int']>;
    /**  Moleculer Counter  */
    moleculerCounter?: Maybe<Counter>;
};

export type Subscription = {
    __typename?: 'Subscription';
    /**  Subscription fired when anyone increases counter  */
    counterUpdated?: Maybe<Counter>;
    dummy?: Maybe<Scalars['Int']>;
    moleculerCounterUpdate?: Maybe<Counter>;
};

export type AddCounterStateMutationVariables = Exact<{
    amount: Scalars['Int'];
}>;

export type AddCounterStateMutation = { __typename?: 'Mutation' } & {
    addCounterState?: Maybe<{ __typename?: 'ClientCounter' } & Pick<ClientCounter, 'counter'>>;
};

export type AddCounterMutationVariables = Exact<{
    amount: Scalars['Int'];
}>;

export type AddCounterMutation = { __typename?: 'Mutation' } & {
    addCounter?: Maybe<{ __typename?: 'Counter' } & Pick<Counter, 'amount'>>;
};

export type AddCounter_WsMutationVariables = Exact<{
    amount: Scalars['Int'];
}>;

export type AddCounter_WsMutation = { __typename?: 'Mutation' } & {
    addCounter?: Maybe<{ __typename?: 'Counter' } & Pick<Counter, 'amount'>>;
};

export type SyncCachedCounterMutationVariables = Exact<{ [key: string]: never }>;

export type SyncCachedCounterMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'syncCachedCounter'>;

export type CounterCacheQueryQueryVariables = Exact<{ [key: string]: never }>;

export type CounterCacheQueryQuery = { __typename?: 'Query' } & {
    counterCache?: Maybe<{ __typename?: 'Counter' } & Pick<Counter, 'amount'>>;
};

export type CounterStateQueryVariables = Exact<{ [key: string]: never }>;

export type CounterStateQuery = { __typename?: 'Query' } & {
    counterState?: Maybe<{ __typename?: 'ClientCounter' } & Pick<ClientCounter, 'counter'>>;
};

export type CounterQueryQueryVariables = Exact<{ [key: string]: never }>;

export type CounterQueryQuery = { __typename?: 'Query' } & {
    counter?: Maybe<{ __typename?: 'Counter' } & Pick<Counter, 'amount'>>;
};

export type OnCounterUpdatedSubscriptionVariables = Exact<{ [key: string]: never }>;

export type OnCounterUpdatedSubscription = { __typename?: 'Subscription' } & {
    counterUpdated?: Maybe<{ __typename?: 'Counter' } & Pick<Counter, 'amount'>>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
    fragment: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
    selectionSet: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
    | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
    | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
    | ResolverFn<TResult, TParent, TContext, TArgs>
    | ResolverWithResolve<TResult, TParent, TContext, TArgs>
    | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
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
    info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
    obj: T,
    context: TContext,
    info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
    next: NextResolverFn<TResult>,
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
    Query: ResolverTypeWrapper<{}>;
    Counter: ResolverTypeWrapper<Counter>;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    ClientCounter: ResolverTypeWrapper<ClientCounter>;
    Mutation: ResolverTypeWrapper<{}>;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
    Subscription: ResolverTypeWrapper<{}>;
    String: ResolverTypeWrapper<Scalars['String']>;
    AnyObject: ResolverTypeWrapper<Scalars['AnyObject']>;
    FieldError: ResolverTypeWrapper<FieldError>;
    JSON: ResolverTypeWrapper<Scalars['JSON']>;
    JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
    Node: never;
    ID: ResolverTypeWrapper<Scalars['ID']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
    Query: {};
    Counter: Counter;
    Int: Scalars['Int'];
    ClientCounter: ClientCounter;
    Mutation: {};
    Boolean: Scalars['Boolean'];
    Subscription: {};
    String: Scalars['String'];
    AnyObject: Scalars['AnyObject'];
    FieldError: FieldError;
    JSON: Scalars['JSON'];
    JSONObject: Scalars['JSONObject'];
    Node: never;
    ID: Scalars['ID'];
};

export interface AnyObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AnyObject'], any> {
    name: 'AnyObject';
}

export type ClientCounterResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['ClientCounter'] = ResolversParentTypes['ClientCounter'],
> = {
    counter?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CounterResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['Counter'] = ResolversParentTypes['Counter'],
> = {
    amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldErrorResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['FieldError'] = ResolversParentTypes['FieldError'],
> = {
    field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
    name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
    name: 'JSONObject';
}

export type MutationResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
    addCounter?: Resolver<
        Maybe<ResolversTypes['Counter']>,
        ParentType,
        ContextType,
        RequireFields<MutationAddCounterArgs, never>
    >;
    addCounterState?: Resolver<
        Maybe<ResolversTypes['ClientCounter']>,
        ParentType,
        ContextType,
        RequireFields<MutationAddCounterStateArgs, 'amount'>
    >;
    addMoleculerCounter?: Resolver<
        Maybe<ResolversTypes['Counter']>,
        ParentType,
        ContextType,
        RequireFields<MutationAddMoleculerCounterArgs, never>
    >;
    dummy?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    syncCachedCounter?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type NodeResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node'],
> = {
    __resolveType: TypeResolveFn<null, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type QueryResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
    counter?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType>;
    counterCache?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType>;
    counterState?: Resolver<Maybe<ResolversTypes['ClientCounter']>, ParentType, ContextType>;
    dummy?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    moleculerCounter?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = {
    counterUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Counter']>, 'counterUpdated', ParentType, ContextType>;
    dummy?: SubscriptionResolver<Maybe<ResolversTypes['Int']>, 'dummy', ParentType, ContextType>;
    moleculerCounterUpdate?: SubscriptionResolver<
        Maybe<ResolversTypes['Counter']>,
        'moleculerCounterUpdate',
        ParentType,
        ContextType
    >;
};

export type Resolvers<ContextType = any> = {
    AnyObject?: GraphQLScalarType;
    ClientCounter?: ClientCounterResolvers<ContextType>;
    Counter?: CounterResolvers<ContextType>;
    FieldError?: FieldErrorResolvers<ContextType>;
    JSON?: GraphQLScalarType;
    JSONObject?: GraphQLScalarType;
    Mutation?: MutationResolvers<ContextType>;
    Node?: NodeResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    Subscription?: SubscriptionResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

export const AddCounterStateDocument = gql`
    mutation addCounterState($amount: Int!) {
        addCounterState(amount: $amount) @client {
            counter
        }
    }
`;

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
export function useAddCounterStateMutation(
    baseOptions?: Apollo.MutationHookOptions<AddCounterStateMutation, AddCounterStateMutationVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<AddCounterStateMutation, AddCounterStateMutationVariables>(
        AddCounterStateDocument,
        options,
    );
}
export type AddCounterStateMutationHookResult = ReturnType<typeof useAddCounterStateMutation>;
export type AddCounterStateMutationResult = Apollo.MutationResult<AddCounterStateMutation>;
export type AddCounterStateMutationOptions = Apollo.BaseMutationOptions<
    AddCounterStateMutation,
    AddCounterStateMutationVariables
>;
export const AddCounterDocument = gql`
    mutation addCounter($amount: Int!) {
        addCounter(amount: $amount) {
            amount
        }
    }
`;

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
export function useAddCounterMutation(
    baseOptions?: Apollo.MutationHookOptions<AddCounterMutation, AddCounterMutationVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<AddCounterMutation, AddCounterMutationVariables>(AddCounterDocument, options);
}
export type AddCounterMutationHookResult = ReturnType<typeof useAddCounterMutation>;
export type AddCounterMutationResult = Apollo.MutationResult<AddCounterMutation>;
export type AddCounterMutationOptions = Apollo.BaseMutationOptions<AddCounterMutation, AddCounterMutationVariables>;
export const AddCounter_WsDocument = gql`
    mutation AddCounter_WS($amount: Int!) {
        addCounter(amount: $amount) {
            amount
        }
    }
`;

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
export function useAddCounter_WsMutation(
    baseOptions?: Apollo.MutationHookOptions<AddCounter_WsMutation, AddCounter_WsMutationVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<AddCounter_WsMutation, AddCounter_WsMutationVariables>(AddCounter_WsDocument, options);
}
export type AddCounter_WsMutationHookResult = ReturnType<typeof useAddCounter_WsMutation>;
export type AddCounter_WsMutationResult = Apollo.MutationResult<AddCounter_WsMutation>;
export type AddCounter_WsMutationOptions = Apollo.BaseMutationOptions<
    AddCounter_WsMutation,
    AddCounter_WsMutationVariables
>;
export const SyncCachedCounterDocument = gql`
    mutation SyncCachedCounter {
        syncCachedCounter
    }
`;

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
export function useSyncCachedCounterMutation(
    baseOptions?: Apollo.MutationHookOptions<SyncCachedCounterMutation, SyncCachedCounterMutationVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<SyncCachedCounterMutation, SyncCachedCounterMutationVariables>(
        SyncCachedCounterDocument,
        options,
    );
}
export type SyncCachedCounterMutationHookResult = ReturnType<typeof useSyncCachedCounterMutation>;
export type SyncCachedCounterMutationResult = Apollo.MutationResult<SyncCachedCounterMutation>;
export type SyncCachedCounterMutationOptions = Apollo.BaseMutationOptions<
    SyncCachedCounterMutation,
    SyncCachedCounterMutationVariables
>;
export const CounterCacheQueryDocument = gql`
    query counterCacheQuery {
        counterCache {
            amount
        }
    }
`;

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
export function useCounterCacheQueryQuery(
    baseOptions?: Apollo.QueryHookOptions<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>(CounterCacheQueryDocument, options);
}
export function useCounterCacheQueryLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>(
        CounterCacheQueryDocument,
        options,
    );
}
export type CounterCacheQueryQueryHookResult = ReturnType<typeof useCounterCacheQueryQuery>;
export type CounterCacheQueryLazyQueryHookResult = ReturnType<typeof useCounterCacheQueryLazyQuery>;
export type CounterCacheQueryQueryResult = Apollo.QueryResult<CounterCacheQueryQuery, CounterCacheQueryQueryVariables>;
export const CounterStateDocument = gql`
    query CounterState {
        counterState @client {
            counter
        }
    }
`;

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
export function useCounterStateQuery(
    baseOptions?: Apollo.QueryHookOptions<CounterStateQuery, CounterStateQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<CounterStateQuery, CounterStateQueryVariables>(CounterStateDocument, options);
}
export function useCounterStateLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<CounterStateQuery, CounterStateQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<CounterStateQuery, CounterStateQueryVariables>(CounterStateDocument, options);
}
export type CounterStateQueryHookResult = ReturnType<typeof useCounterStateQuery>;
export type CounterStateLazyQueryHookResult = ReturnType<typeof useCounterStateLazyQuery>;
export type CounterStateQueryResult = Apollo.QueryResult<CounterStateQuery, CounterStateQueryVariables>;
export const CounterQueryDocument = gql`
    query counterQuery {
        counter {
            amount
        }
    }
`;

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
export function useCounterQueryQuery(
    baseOptions?: Apollo.QueryHookOptions<CounterQueryQuery, CounterQueryQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<CounterQueryQuery, CounterQueryQueryVariables>(CounterQueryDocument, options);
}
export function useCounterQueryLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<CounterQueryQuery, CounterQueryQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<CounterQueryQuery, CounterQueryQueryVariables>(CounterQueryDocument, options);
}
export type CounterQueryQueryHookResult = ReturnType<typeof useCounterQueryQuery>;
export type CounterQueryLazyQueryHookResult = ReturnType<typeof useCounterQueryLazyQuery>;
export type CounterQueryQueryResult = Apollo.QueryResult<CounterQueryQuery, CounterQueryQueryVariables>;
export const OnCounterUpdatedDocument = gql`
    subscription onCounterUpdated {
        counterUpdated {
            amount
        }
    }
`;

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
export function useOnCounterUpdatedSubscription(
    baseOptions?: Apollo.SubscriptionHookOptions<OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useSubscription<OnCounterUpdatedSubscription, OnCounterUpdatedSubscriptionVariables>(
        OnCounterUpdatedDocument,
        options,
    );
}
export type OnCounterUpdatedSubscriptionHookResult = ReturnType<typeof useOnCounterUpdatedSubscription>;
export type OnCounterUpdatedSubscriptionResult = Apollo.SubscriptionResult<OnCounterUpdatedSubscription>;
