import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { PERSONS_QUERY, getPersonsQuery } from '@sample-stack/client-state';
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
        graphql<{}, getPersonsQuery, {}, {}>(PERSONS_QUERY),
        // flattenProp('data'),
    )(PersonListComponent);
