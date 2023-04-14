import * as React from 'react';
import { ApolloProvider } from '@apollo/react-common';
import { Provider, ReactReduxContext } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { epic$ } from '../config/options/epic-config';
import { createClientContainer } from '../config/options/client.service';
import { createReduxStore, history } from '../config/options/redux-config';
import { MainRoute } from '../modules/options';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client, container } = createClientContainer();

let store = createReduxStore();

const key = 'custom';
const cache = createCache({ key });
export class Main extends React.Component<{}, {}> {

    componentDidMount() {
        store.dispatch({ type: '@@REDUX_INIT' })
    }

    public render() {
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <ApolloProvider client={client}>
                        <CacheProvider value={cache}>
                            <ConnectedRouter history={history} context={ReactReduxContext}>
                                <MainRoute />
                            </ConnectedRouter>,
                        </CacheProvider>
                    </ApolloProvider>
                </Provider>
            </ErrorBoundary>
        );
    }
}

export default Main;