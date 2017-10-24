import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactFela from 'react-fela';
import { Counter, PersonList, CounterWithApollo } from '@sample-stack/client-react';
import { ApolloProvider } from 'react-apollo';


export const Component = () => (
    <div>
        <div>
            <h2>Redux Counter Test</h2>
            <Counter label="count:" />
        </div>
        <div>
            <h2>Apollo Graphql Test </h2>
            <CounterWithApollo />
            <PersonList />
        </div>
    </div>
);
