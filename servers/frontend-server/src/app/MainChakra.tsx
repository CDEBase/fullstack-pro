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
import createEmotionCache from '../common/createEmotionCache';
import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';

const { apolloClient: client } = createClientContainer();
const history = createBrowserHistory();
const { store } = createReduxStore(history);

const WithChakra = () => {
    if (__CHAKRA__) {
        const cache = createEmotionCache();
        return (
            <CacheProvider value={cache}>
                {modules.getWrappedRoot(
                    <ConnectedRouter history={history}>
                        <MainRoute />
                    </ConnectedRouter>,
                )}
            </CacheProvider>
        );
    } else {
        return 
            modules.getWrappedRoot(
                <ConnectedRouter history={history}>
                    <MainRoute />
                </ConnectedRouter>,
            );
    }
}

const WithPersistGate = () => {
    let persistor = persistStore(store);
    if (__SSR__) {
        return (
            <PersistGate loading={null} persistor={persistor}>
                {() => <WithChakra />}
            </PersistGate>
        );
    } else {
        return (
            <PersistGate persistor={persistor}>
                <WithChakra />
            </PersistGate>
        );
    }
}

const Main = () => (
    <HelmetProvider>
        <Provider store={store}>
            <ApolloProvider client={client}>
                <WithPersistGate />
            </ApolloProvider>
        </Provider>
    </HelmetProvider>
);

export default Main;
