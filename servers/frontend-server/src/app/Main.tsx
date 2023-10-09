/// <reference path='../../../../typings/index.d.ts' />
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';

import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history);

export class Main extends React.Component<{}, {}> {
  public render() {
    let persistor = persistStore(store);
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ApolloProvider client={client}>
              <PersistGate persistor={persistor}>
                {modules.getWrappedRoot(
                  (
                    <ConnectedRouter history={history}>
                      <MainRoute />
                    </ConnectedRouter>
                  ),
                )}
              </PersistGate>
          </ApolloProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
}

export default Main;
