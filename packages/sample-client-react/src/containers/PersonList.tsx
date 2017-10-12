import * as React from 'react';
import { graphql, gql } from 'react-apollo';
import { pure, compose, flattenProp } from 'recompose';
import { PERSONS_QUERY, GetPersonsQuery } from '@sample-stack/graphql';
import { ApolloQueryResult } from 'apollo-client';

export interface IPersonListProps {
    persons;
}
const PersonListComponent: React.SFC<IPersonListProps> = ({ persons }) => (
    <div>
        <h2>Persons:</h2>
        {console.log(persons)} {persons && persons.map((person, i) => <div key={i}>{person.name}</div>)}
    </div>
);

export const PersonList: React.ComponentClass<{}> =
    compose(
        graphql<GetPersonsQuery>(PERSONS_QUERY),
        flattenProp('data'),
        pure,
    )(PersonListComponent);
