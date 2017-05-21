import * as React from 'react';
import { graphql, gql } from 'react-apollo';
import { pure, compose, flattenProp } from 'recompose';
import { getPersons } from '@sample/graphql';

// const getPersons = gql`query getPersons {
//     persons {
//         id
//         name
//     }
// }`
export interface IPersonListProps {
    persons
}
const PersonListComponent: React.SFC<IPersonListProps> = ({ persons }) => (
    <div>
        <h2>Persons:</h2>
        {console.log(persons)} {persons && persons.map((person, i) => <div key={i}>{person.name}</div>)}
    </div>
);

export const PersonList: React.ComponentClass<{}> =
    compose(
        graphql(getPersons),
        flattenProp('data'),
        pure
    )(PersonListComponent);