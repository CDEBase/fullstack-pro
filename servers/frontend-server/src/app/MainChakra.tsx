/// <reference path='../../../../typings/index.d.ts' />
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { CacheProvider } from '@emotion/react';

import createEmotionCache from '../common/createEmotionCache';
import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';

const { apolloClient: client } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history);
const cache = createEmotionCache();
let persistor = persistStore(store);

export class Main extends React.Component<{}, {}> {
    public render() {
        if (__SSR__) {
            return (
                <HelmetProvider>
                    <CacheProvider value={cache}>
                        <ReduxProvider store={store}>
                            <PersistGate loading={null} persistor={persistor}>
                                {() => (
                                    <ApolloProvider client={client}>
                                        {modules.getWrappedRoot(
                                            <ConnectedRouter history={history}>
                                                <MainRoute />
                                            </ConnectedRouter>,
                                        )}
                                    </ApolloProvider>
                                )}
                            </PersistGate>
                        </ReduxProvider>
                    </CacheProvider>
                </HelmetProvider>
            );
        } else {
            return (
                <HelmetProvider>
                    <CacheProvider value={cache}>
                        <ReduxProvider store={store}>
                            <PersistGate persistor={persistor}>
                                <ApolloProvider client={client}>
                                    <ConnectedRouter history={history}>
                                        {modules.getWrappedRoot(<MainRoute />)}
                                    </ConnectedRouter>
                                </ApolloProvider>
                            </PersistGate>
                        </ReduxProvider>
                    </CacheProvider>
                </HelmetProvider>
            );
        }
    }
}

export default Main;
