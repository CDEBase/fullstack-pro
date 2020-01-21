import * as React from 'react';
import { graphql } from 'react-apollo';
import compose from 'lodash/flowRight';
import { PERSONS_QUERY, getPersonsQuery } from '@sample-stack/client-state';

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
