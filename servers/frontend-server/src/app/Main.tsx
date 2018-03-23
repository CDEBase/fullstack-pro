/// <reference path='../../../../typings/index.d.ts' />
///<reference types="webpack-env" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactFela from 'react-fela';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import createRenderer from '../config/fela-renderer';
import { createApolloClient } from '../config/apollo-client';
import { createReduxStore, storeReducer } from '../config/redux-config';
import { Component } from '../components';
import { createRenderer as createFelaRenderer } from 'fela';
import modules from '../modules';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { Switch } from 'react-router-dom';
import RedBox from './RedBox';
import createHistory from 'history/createBrowserHistory';
import { ServerError } from './Error';
import { hot, setConfig } from 'react-hot-loader';
setConfig({ logLevel: 'debug' });


import '../index.css';

const rootEl = document.getElementById('content');


const client = createApolloClient();

let store;
if ((module as any).hot && (module as any).hot.data && (module as any).hot.data.store) {
  // console.log("Restoring Redux store:", JSON.stringify((module as any).hot.data.store.getState()));
  store = (module as any).hot.data.store;
  store.replaceReducer(storeReducer);
} else {
  store = createReduxStore();
}
if ((module as any).hot) {
  (module as any).hot.dispose(data => {
    // console.log("Saving Redux store:", JSON.stringify(store.getState()));
    data.store = store;
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
}

const history: History = createHistory();

export interface MainState {
  error?: ServerError;
  info?: any;
}

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
    const renderer = createFelaRenderer();

    return this.state.error ? (
      <RedBox error={this.state.error} />
    ) : (
        modules.getWrappedRoot(
          <Provider store={store}>
            <ApolloProvider client={client}>
              <ReactFela.Provider renderer={renderer}>
                <ConnectedRouter history={history}>
                  {modules.router}
                </ConnectedRouter>
              </ReactFela.Provider>
            </ApolloProvider>
          </Provider>,
        )
      );
  }
}

export default hot(module as any)(Main);
