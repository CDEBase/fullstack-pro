/// <reference path='../../../../typings/index.d.ts' />
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { RendererProvider } from 'react-fela';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import createRenderer from '../config/fela-renderer';
import { rehydrate } from 'fela-dom';
// import { epic$ } from '../config/epic-config';
import {
  createReduxStore,
  history,
} from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client } = createClientContainer();

const store = createReduxStore();

export class Main extends React.Component<{}, {}> {

  componentDidMount() {
    store.dispatch({ type: '@@REDUX_INIT' })
  }

  public render() {
    const renderer = createRenderer();
    let persistor = persistStore(store);
    rehydrate(renderer);
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <RendererProvider renderer={renderer}>
              <PersistGate persistor={persistor}>
                {modules.getWrappedRoot(
                  (
                    <ConnectedRouter history={history}>
                      <MainRoute />
                    </ConnectedRouter>
                  ),
                )}
              </PersistGate>
            </RendererProvider>
          </ApolloProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
}

export default hot(Main);
