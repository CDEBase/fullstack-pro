/// <reference path='../../../../typings/index.d.ts' />
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { HistoryRouter  } from 'redux-first-history/rr6';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';

import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';

const { apolloClient: client } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history);

export class Main extends React.Component<{}, {}> {
    public render() {
        if (__SSR__) {
            let persistor = persistStore(store);
            return (
                <HelmetProvider>
                    <ReduxProvider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            {() => (
                                <ApolloProvider client={client}>
                                    {modules.getWrappedRoot(
                                        <HistoryRouter history={history}>
                                            <MainRoute />
                                        </HistoryRouter>,
                                    )}
                                </ApolloProvider>
                            )}
                        </PersistGate>
                    </ReduxProvider>
                </HelmetProvider>
            );
        } else {
            let persistor = persistStore(store);
            return (
                <HelmetProvider>
                    <ReduxProvider store={store}>
                        <PersistGate persistor={persistor}>
                            <ApolloProvider client={client}>
                                <HistoryRouter history={history}>
                                    {modules.getWrappedRoot(<MainRoute />)}
                                </HistoryRouter>
                            </ApolloProvider>
                        </PersistGate>
                    </ReduxProvider>
                </HelmetProvider>
            );
        }
    }
}

export default Main;
