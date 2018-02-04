import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { pure, compose, flattenProp } from 'recompose';
import { PERSONS_QUERY, getPersonsQuery } from '@sample-stack/graphql-gql';
import { ApolloQueryResult } from 'apollo-client';

export interface IPersonListProps {
    persons;
}
const PersonListComponent: React.SFC<IPersonListProps> = ({ persons }) => (
    <div>
        <h2>Persons:</h2>
       {persons && persons.map((person, i) => <div key={i}>{person.name}</div>)}
    </div>
);

export const PersonList: React.ComponentClass<{}> =
    compose(
        graphql<getPersonsQuery>(PERSONS_QUERY),
        flattenProp('data'),
        pure,
    )(PersonListComponent);
