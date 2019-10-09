/* tslint:disable */

export type Maybe<T> = T | null;
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
  Date: any;
  Time: any;
  DateTime: any;
};

export type ClientCounter = {
  counter?: Maybe<Scalars["Int"]>;
};

export type Counter = {
  amount: Scalars["Int"];
};

export type FieldError = {
  field: Scalars["String"];
  message: Scalars["String"];
};

export type Mutation = {
  dummy?: Maybe<Scalars["Int"]>;
  addCounterState?: Maybe<ClientCounter>;
  addCounter?: Maybe<Counter>;
};

export type MutationAddCounterStateArgs = {
  amount: Scalars["Int"];
};

export type MutationAddCounterArgs = {
  amount?: Maybe<Scalars["Int"]>;
};

export type Node = {
  id: Scalars["ID"];
};

export type Query = {
  dummy?: Maybe<Scalars["Int"]>;
  counterState?: Maybe<ClientCounter>;
  counter?: Maybe<Counter>;
};

export type Subscription = {
  dummy?: Maybe<Scalars["Int"]>;
  counterUpdated?: Maybe<Counter>;
};

export type AddCounterStateMutationVariables = {
  amount: Scalars["Int"];
};

export type AddCounterStateMutation = { __typename?: "Mutation" } & {
  addCounterState: Maybe<
    { __typename?: "ClientCounter" } & Pick<ClientCounter, "counter">
  >;
};

export type AddCounterMutationVariables = {
  amount: Scalars["Int"];
};

export type AddCounterMutation = { __typename?: "Mutation" } & {
  addCounter: Maybe<{ __typename?: "Counter" } & Pick<Counter, "amount">>;
};

export type CounterStateQueryVariables = {};

export type CounterStateQuery = { __typename?: "Query" } & {
  counterState: Maybe<
    { __typename?: "ClientCounter" } & Pick<ClientCounter, "counter">
  >;
};

export type CounterQueryQueryVariables = {};

export type CounterQueryQuery = { __typename?: "Query" } & {
  counter: Maybe<{ __typename?: "Counter" } & Pick<Counter, "amount">>;
};

export type OnCounterUpdatedSubscriptionVariables = {};

export type OnCounterUpdatedSubscription = { __typename?: "Subscription" } & {
  counterUpdated: Maybe<{ __typename?: "Counter" } & Pick<Counter, "amount">>;
};
import { MyContext } from "./interfaces/context";

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";


export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: {};
  Int: Scalars["Int"];
  ClientCounter: ClientCounter;
  Counter: Counter;
  Mutation: {};
  Subscription: {};
  String: Scalars["String"];
  Boolean: Scalars["Boolean"];
  AnyObject: Scalars["AnyObject"];
  JSON: Scalars["JSON"];
  JSONObject: Scalars["JSONObject"];
  FieldError: FieldError;
  Node: Node;
  ID: Scalars["ID"];
  Date: Scalars["Date"];
  Time: Scalars["Time"];
  DateTime: Scalars["DateTime"];
};

export interface AnyObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["AnyObject"], any> {
  name: "AnyObject";
}

export type ClientCounterResolvers<
  ContextType = MyContext,
  ParentType = ResolversTypes["ClientCounter"]
> = {
  counter?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type CounterResolvers<
  ContextType = MyContext,
  ParentType = ResolversTypes["Counter"]
> = {
  amount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type FieldErrorResolvers<
  ContextType = MyContext,
  ParentType = ResolversTypes["FieldError"]
> = {
  field?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export interface JsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSONObject"], any> {
  name: "JSONObject";
}

export type MutationResolvers<
  ContextType = MyContext,
  ParentType = ResolversTypes["Mutation"]
> = {
  dummy?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  addCounterState?: Resolver<
    Maybe<ResolversTypes["ClientCounter"]>,
    ParentType,
    ContextType,
    MutationAddCounterStateArgs
  >;
  addCounter?: Resolver<
    Maybe<ResolversTypes["Counter"]>,
    ParentType,
    ContextType,
    MutationAddCounterArgs
  >;
};

export type NodeResolvers<
  ContextType = MyContext,
  ParentType = ResolversTypes["Node"]
> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = MyContext,
  ParentType = ResolversTypes["Query"]
> = {
  dummy?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  counterState?: Resolver<
    Maybe<ResolversTypes["ClientCounter"]>,
    ParentType,
    ContextType
  >;
  counter?: Resolver<Maybe<ResolversTypes["Counter"]>, ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = MyContext,
  ParentType = ResolversTypes["Subscription"]
> = {
  dummy?: SubscriptionResolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  counterUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes["Counter"]>,
    ParentType,
    ContextType
  >;
};

export interface TimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Time"], any> {
  name: "Time";
}

export type Resolvers<ContextType = MyContext> = {
  AnyObject?: GraphQLScalarType;
  ClientCounter?: ClientCounterResolvers<ContextType>;
  Counter?: CounterResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  FieldError?: FieldErrorResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Time?: GraphQLScalarType;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MyContext> = Resolvers<ContextType>;

import gql from "graphql-tag";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const AddCounterStateDocument = gql`
  mutation addCounterState($amount: Int!) {
    addCounterState(amount: $amount) @client {
      counter
    }
  }
`;
export const AddCounterDocument = gql`
  mutation addCounter($amount: Int!) {
    addCounter(amount: $amount) {
      amount
    }
  }
`;
export const CounterStateDocument = gql`
  query CounterState {
    counterState @client {
      counter
    }
  }
`;
export const CounterQueryDocument = gql`
  query counterQuery {
    counter {
      amount
    }
  }
`;
export const OnCounterUpdatedDocument = gql`
  subscription onCounterUpdated {
    counterUpdated {
      amount
    }
  }
`;
