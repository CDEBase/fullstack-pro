/* tslint:disable */
import {
  AddCounterStateMutation,
  AddCounterStateMutationVariables,
  AddCounterMutation,
  AddCounterMutationVariables,
  CounterStateQuery,
  CounterStateQueryVariables,
  CounterQueryQueryVariables,
  CounterQueryQuery,
  OnCounterUpdatedSubscription,
  OnCounterUpdatedSubscriptionVariables
} from "../common/generated-models";

import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const AddCounterStateDocument = gql`
  mutation addCounterState($amount: Int!) {
    addCounterState(amount: $amount) @client {
      counter
    }
  }
`;
export type AddCounterStateMutationFn = ReactApollo.MutationFn<
  AddCounterStateMutation,
  AddCounterStateMutationVariables
>;

export const AddCounterStateComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        AddCounterStateMutation,
        AddCounterStateMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: AddCounterStateMutationVariables }
) => (
  <ReactApollo.Mutation<
    AddCounterStateMutation,
    AddCounterStateMutationVariables
  >
    mutation={AddCounterStateDocument}
    {...props}
  />
);

export type AddCounterStateProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    AddCounterStateMutation,
    AddCounterStateMutationVariables
  >
> &
  TChildProps;
export function withAddCounterState<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddCounterStateMutation,
    AddCounterStateMutationVariables,
    AddCounterStateProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddCounterStateMutation,
    AddCounterStateMutationVariables,
    AddCounterStateProps<TChildProps>
  >(AddCounterStateDocument, {
    alias: "withAddCounterState",
    ...operationOptions
  });
}
export const AddCounterDocument = gql`
  mutation addCounter($amount: Int!) {
    addCounter(amount: $amount) {
      amount
    }
  }
`;
export type AddCounterMutationFn = ReactApollo.MutationFn<
  AddCounterMutation,
  AddCounterMutationVariables
>;

export const AddCounterComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        AddCounterMutation,
        AddCounterMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: AddCounterMutationVariables }
) => (
  <ReactApollo.Mutation<AddCounterMutation, AddCounterMutationVariables>
    mutation={AddCounterDocument}
    {...props}
  />
);

export type AddCounterProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<AddCounterMutation, AddCounterMutationVariables>
> &
  TChildProps;
export function withAddCounter<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddCounterMutation,
    AddCounterMutationVariables,
    AddCounterProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddCounterMutation,
    AddCounterMutationVariables,
    AddCounterProps<TChildProps>
  >(AddCounterDocument, {
    alias: "withAddCounter",
    ...operationOptions
  });
}
export const CounterStateDocument = gql`
  query CounterState {
    counterState @client {
      counter
    }
  }
`;

export const CounterStateComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<CounterStateQuery, CounterStateQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: CounterStateQueryVariables }
) => (
  <ReactApollo.Query<CounterStateQuery, CounterStateQueryVariables>
    query={CounterStateDocument}
    {...props}
  />
);

export type CounterStateProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<CounterStateQuery, CounterStateQueryVariables>
> &
  TChildProps;
export function withCounterState<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    CounterStateQuery,
    CounterStateQueryVariables,
    CounterStateProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    CounterStateQuery,
    CounterStateQueryVariables,
    CounterStateProps<TChildProps>
  >(CounterStateDocument, {
    alias: "withCounterState",
    ...operationOptions
  });
}
export const CounterQueryDocument = gql`
  query counterQuery {
    counter {
      amount
    }
  }
`;

export const CounterQueryComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<CounterQueryQuery, CounterQueryQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: CounterQueryQueryVariables }
) => (
  <ReactApollo.Query<CounterQueryQuery, CounterQueryQueryVariables>
    query={CounterQueryDocument}
    {...props}
  />
);

export type CounterQueryProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<CounterQueryQuery, CounterQueryQueryVariables>
> &
  TChildProps;
export function withCounterQuery<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    CounterQueryQuery,
    CounterQueryQueryVariables,
    CounterQueryProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    CounterQueryQuery,
    CounterQueryQueryVariables,
    CounterQueryProps<TChildProps>
  >(CounterQueryDocument, {
    alias: "withCounterQuery",
    ...operationOptions
  });
}
export const OnCounterUpdatedDocument = gql`
  subscription onCounterUpdated {
    counterUpdated {
      amount
    }
  }
`;

export const OnCounterUpdatedComponent = (
  props: Omit<
    Omit<
      ReactApollo.SubscriptionProps<
        OnCounterUpdatedSubscription,
        OnCounterUpdatedSubscriptionVariables
      >,
      "subscription"
    >,
    "variables"
  > & { variables?: OnCounterUpdatedSubscriptionVariables }
) => (
  <ReactApollo.Subscription<
    OnCounterUpdatedSubscription,
    OnCounterUpdatedSubscriptionVariables
  >
    subscription={OnCounterUpdatedDocument}
    {...props}
  />
);

export type OnCounterUpdatedProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    OnCounterUpdatedSubscription,
    OnCounterUpdatedSubscriptionVariables
  >
> &
  TChildProps;
export function withOnCounterUpdated<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    OnCounterUpdatedSubscription,
    OnCounterUpdatedSubscriptionVariables,
    OnCounterUpdatedProps<TChildProps>
  >
) {
  return ReactApollo.withSubscription<
    TProps,
    OnCounterUpdatedSubscription,
    OnCounterUpdatedSubscriptionVariables,
    OnCounterUpdatedProps<TChildProps>
  >(OnCounterUpdatedDocument, {
    alias: "withOnCounterUpdated",
    ...operationOptions
  });
}
