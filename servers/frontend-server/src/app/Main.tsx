/// <reference path='../../../../typings/index.d.ts' />
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { CacheProvider } from '@emotion/react';
import { hydrate } from '@emotion/css';

import createEmotionCache from '../common/createEmotionCache';
import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';

const { apolloClient: client } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history);
const cache = createEmotionCache();

export class Main extends React.Component<{}, {}> {
    public render() {
        if (__SSR__) {
            // hydrate(window.__EMOTION_IDS__);
            let persistor = persistStore(store);
            return (
                <HelmetProvider>
                    <Provider store={store}>
                        <ApolloProvider client={client}>
                            <PersistGate loading={null} persistor={persistor}>
                                {() => (
                                    <CacheProvider value={cache}>
                                        {modules.getWrappedRoot(
                                            <ConnectedRouter history={history}>
                                                <MainRoute />
                                            </ConnectedRouter>,
                                        )}
                                    </CacheProvider>
                                )}
                            </PersistGate>
                        </ApolloProvider>
                    </Provider>
                </HelmetProvider>
            );
        } else {
            let persistor = persistStore(store);
            return (
                <HelmetProvider>
                    <Provider store={store}>
                        <ApolloProvider client={client}>
                            <PersistGate persistor={persistor}>
                                <CacheProvider value={cache}>
                                    {modules.getWrappedRoot(
                                        <ConnectedRouter history={history}>
                                            <MainRoute />
                                        </ConnectedRouter>,
                                    )}
                                </CacheProvider>
                            </PersistGate>
                        </ApolloProvider>
                    </Provider>
                </HelmetProvider>
            );
        }
    }
}

export default Main;
