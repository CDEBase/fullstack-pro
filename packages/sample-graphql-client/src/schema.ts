/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type AddCountMutationVariables = {
  amount: number,
};

export type AddCountMutation = {
  // Increase counter value, returns current counter amount
  addCount:  {
    // Current amount
    amount: number,
  } | null,
};

export type AddPersonMutationVariables = {
  name: string,
  sex: string,
};

export type AddPersonMutation = {
  addPerson:  {
    id: string | null,
    name: string | null,
  } | null,
};

export type GetCountQuery = {
  // Counter
  count:  {
    // Current amount
    amount: number,
  } | null,
};

export type GetPersonQueryVariables = {
  id: string,
};

export type GetPersonQuery = {
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
        } > | null,
      } > | null,
    } > | null,
  } | null,
};

export type GetPersonsQuery = {
  persons:  Array< {
    id: string | null,
    name: string | null,
  } > | null,
};

export type OnCountUpdatedSubscription = {
  // Subscription fired when anyone increases counter
  countUpdated:  {
    // Current amount
    amount: number,
  } | null,
};
/* tslint:enable */
