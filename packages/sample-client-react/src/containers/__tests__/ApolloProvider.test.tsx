import * as React from 'react';
import { shallow } from 'enzyme';
import { createStore } from 'redux';
import * as PropTypes from 'prop-types';

declare function require(name: string);
import * as TestUtils from 'react-addons-test-utils';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

interface ChildContext {
    store: Object;
    client: Object;
}

describe('<ApolloProvider /> Component', () => {

    class Child extends React.Component<any, { store: any, client: any }> {
        static contextTypes: React.ValidationMap<any> = {
            client: PropTypes.object.isRequired,
            store: PropTypes.object.isRequired,
        };

        context: ChildContext;

        render() {
            return <div />;
        }
    }

    const client = new ApolloClient();
    const store = createStore(() => ({}));

    it('should render children components', () => {
        const wrapper = shallow(
            <ApolloProvider store={store} client={client}>
                <div className='unique' />
            </ApolloProvider>
        );

        expect(wrapper.contains(<div className='unique' />)).toBe(true);
    })
})