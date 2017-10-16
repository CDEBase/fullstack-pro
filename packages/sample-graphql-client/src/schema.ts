/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type addCountMutationVariables = {
  amount: number,
};

export type addCountMutation = {
  // Increase counter value, returns current counter amount
  addCount:  {
    // Current amount
    amount: number,
  } | null,
};

export type addPersonMutationVariables = {
  name: string,
  sex: string,
};

export type addPersonMutation = {
  addPerson:  {
    id: string | null,
    name: string | null,
  } | null,
};

export type getCountQuery = {
  // Counter
  count:  {
    // Current amount
    amount: number,
  } | null,
};

export type getPersonQueryVariables = {
  id: string,
};

export type getPersonQuery = {
  getPerson:  {
    id: string | null,
    name: string | null,
    sex: string | null,
    matches:  Array< {
      id: string | null,
      name: string | null,
      sex: string | null,
      matches:  Array< {
        id: string | null,
        name: string | null,
        sex: string | null,
        matches:  Array< {
          id: string | null,
          name: string | null,
          sex: string | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
  } | null,
};

export type getPersonsQuery = {
  persons:  Array< {
    id: string | null,
    name: string | null,
  } | null > | null,
};

export type subscribeToCountSubscription = {
  // Subscription fired when anyone increases counter
  subscribeToCount:  {
    // Current amount
    amount: number,
  } | null,
};
/* tslint:enable */
