/// <reference path='../../../../typings/index.d.ts' />
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { HelmetProvider } from 'react-helmet-async';
import { CacheProvider } from '@emotion/react';
import { HistoryRouter } from 'redux-first-history/rr6';
import { createBrowserHistory } from 'history';
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
                      <HistoryRouter history={history}>
                        <MainRoute />
                      </HistoryRouter>,
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
                  <HistoryRouter history={history}>
                    {modules.getWrappedRoot(<MainRoute />)}
                  </HistoryRouter>
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
