declare module "*/AddCounter.client.gql" {
  import { DocumentNode } from "graphql";
  const defaultDocument: DocumentNode;
  export const addCounterState: DocumentNode;

  export default defaultDocument;
}

declare module "*/AddCounter.gql" {
  import { DocumentNode } from "graphql";
  const defaultDocument: DocumentNode;
  export const addCounter: DocumentNode;

  export default defaultDocument;
}

declare module "*/CounterQuery.client.gql" {
  import { DocumentNode } from "graphql";
  const defaultDocument: DocumentNode;
  export const CounterState: DocumentNode;

  export default defaultDocument;
}

declare module "*/CounterQuery.gql" {
  import { DocumentNode } from "graphql";
  const defaultDocument: DocumentNode;
  export const counterQuery: DocumentNode;

  export default defaultDocument;
}

declare module "*/CounterSubscription.gql" {
  import { DocumentNode } from "graphql";
  const defaultDocument: DocumentNode;
  export const onCounterUpdated: DocumentNode;

  export default defaultDocument;
}
