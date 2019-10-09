// import * as React from 'react';
// import * as renderer from 'react-test-renderer';
// import { mount, shallow } from 'enzyme';
// import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { connect } from 'react-redux';
// import { print } from 'graphql';
// import gql from 'graphql-tag';

// declare function require(name: string);

// import ApolloClient from 'apollo-client';
// import { ApolloProvider, graphql } from 'react-apollo';
// import { mockNetworkInterface } from 'react-apollo/test-utils';

// describe('redux integration', () => {
//     it('updates child props on state change', (done) => {
//         const query = gql`query people($first: Int) { allPeople(first: $first) { people { name } } }`;
//         const data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
//         const variables = { first: 1 };

//         const data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
//         const variables2 = { first: 2 };

//         const networkInterface = mockNetworkInterface(
//             { request: { query, variables }, result: { data } },
//             { request: { query, variables: variables2 }, result: { data: data2 } },
//         );


//         const client = new ApolloClient({ networkInterface, addTypename: false });
//         let wrapper;

//         function counter(state = 1, action) {
//             switch (action.type) {
//                 case 'INCREMENT':
//                     return state + 1;
//                 default:
//                     return state;
//             }
//         }

//         // Typscript workaround
//         const apolloReducer = client.reducer() as () => any;

//         const store = createStore(
//             combineReducers({
//                 counter,
//                 apollo: apolloReducer,
//             }),
//             applyMiddleware(client.middleware()),
//         );


//         class Component extends React.Component<any, any> {
//             public componentWillReceiveProps(nextProps) {
//                 // trigger redux action
//                 if (nextProps.first === 1) {
//                     this.props.dispatch({ type: 'INCREMENT' });
//                 }

//                 if (nextProps.first === 2) {
//                     if (nextProps.data.loading) { return; }
//                     expect(nextProps.data.allPeople.people).toContain(data2.allPeople.people);
//                     done();
//                 }

//             }
//             public render() {
//                 return null;
//             }
//         }
//         const Container: React.ComponentClass<{}> = compose(
//             connect((state) => ({ first: state.counter })),
//             graphql(query),
//             flattenProp('data'),
//             pure,
//         )(Component);

//         wrapper = renderer.create(
//             <ApolloProvider client={client} store={store}>
//                 <Container />
//             </ApolloProvider>,
//         );
//     });

// });
