/// <reference path='../../../../typings/index.d.ts' />
///<reference types="webpack-env" />
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import * as ReactFela from 'react-fela';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import createRenderer from '../config/fela-renderer';
import { rehydrate, render } from 'fela-dom';
import { createApolloClient } from '../config/apollo-client';
import { epic$, rootEpic } from '../config/epic-config';
import {
  createReduxStore,
  storeReducer,
  history,
  persistConfig,
  epicMiddleware,
} from '../config/redux-config';
import modules, { MainRoute } from '../modules';
import { ConnectedRouter } from 'connected-react-router';
import RedBox from './RedBox';
import { ServerError } from './Error';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';


const client = createApolloClient();

let store;
if (module.hot && module.hot.data && module.hot.data.store) {
  // console.log('Restoring Redux store:', JSON.stringify(module.hot.data.store.getState()));
  store = module.hot.data.store;
  // replace the reducers always as we don't have ablity to find
  // new reducer added through our `modules`
  store.replaceReducer(persistReducer(persistConfig, storeReducer(module.hot.data.history || history)));
} else {
  store = createReduxStore();
}
if (module.hot) {
  module.hot.dispose(data => {
    // console.log("Saving Redux store:", JSON.stringify(store.getState()));
    data.store = store;
    data.history = history;
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
  module.hot.accept('../config/epic-config', () => {
    // we may need to reload epic always as we don't
    // know whether it is updated using our `modules`
    const nextRootEpic = require('../config/epic-config').rootEpic;
    // First kill any running epics
    store.dispatch({ type: 'EPIC_END' });
    // Now setup the new one
    epic$.next(nextRootEpic);
  });
}

export interface MainState {
  error?: ServerError;
  info?: any;
}

const mountNode = document.getElementById('stylesheet');

export class Main extends React.Component<any, MainState> {
  constructor(props: any) {
    super(props);
    const serverError: any = window.__SERVER_ERROR__;
    if (serverError) {
      this.state = { error: new ServerError(serverError) };
    } else {
      this.state = {};
    }
  }

  public componentDidCatch(error: ServerError, info: any) {
    this.setState({ error, info });
  }

  public render() {
    const renderer = createRenderer();
    let persistor = persistStore(store);
    rehydrate(renderer);
    return this.state.error ? (
      <RedBox error={this.state.error} />
    ) : (
        modules.getWrappedRoot(
          // tslint:disable-next-line:jsx-wrap-multiline
          <Provider store={store}>
            <ApolloProvider client={client}>
              <ReactFela.RendererProvider mountNode={mountNode} renderer={renderer}>
                <PersistGate persistor={persistor}>
                  {modules.getWrappedRoot(
                    <ConnectedRouter history={history}>
                      <MainRoute />
                    </ConnectedRouter>,
                  )}
                </PersistGate>
              </ReactFela.RendererProvider>
            </ApolloProvider>
          </Provider>,
        )
      );
  }
}

export default hot(Main);
