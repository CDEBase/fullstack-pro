// import 'jest';
// import * as React from 'react';
// import { shallow, mount } from 'enzyme';
// import ApolloClient from 'apollo-client';
// import { MockedProvider } from 'react-apollo/test-utils';
// import './setup';

// declare function require(name: string);
// import * as TestUtils from 'react-addons-test-utils';
// import { createStore, combineReducers, applyMiddleware } from 'redux';
// import gql from 'graphql-tag';

// import { PersonList } from '../PersonList';
// import { reducers, Store } from '@sample-stack/client-state';
// import { ApolloProvider, graphql, createNetworkInterface } from 'react-apollo';
// import { database } from '@sample-stack/graphql-schema';
// import { mockNetworkInterface } from 'apollo-test-utils';
// import { PERSONS_QUERY } from '@sample-stack/client-state';

// describe('components/PersonList', () => {
//   it('renders correctly', (done) => {
//     const networkInterface = mockNetworkInterface({
//       request: { query: PERSONS_QUERY, variables: {} }, result: { data: database.persons },
//     });

//     const client = new ApolloClient({
//       networkInterface: networkInterface,
//     });


//     const store = createStore(combineReducers({
//       ...reducers,
//       apollo: client.reducer(),
//     }), applyMiddleware(client.middleware()));


//     expect(mount(
//       <ApolloProvider client={client} store={store}>
//         <PersonList />
//       </ApolloProvider>,
//     )).toMatchSnapshot();
//   });
// });
