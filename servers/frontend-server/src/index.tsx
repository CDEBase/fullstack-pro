/// <reference path='../../../typings/index.d.ts' />
///<reference types="webpack-env" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactFela from 'react-fela';
import { ApolloProvider } from 'react-apollo';
import { Provider as ReduxProvider } from 'react-redux';
import createRenderer from './setup/fela-renderer';
import { createApolloClient } from './setup/apollo-client';
import { createReduxStore } from './redux-config';
import { Component } from './components';
import { createRenderer as createFelaRenderer } from 'fela';

require('backend_reload');

import './index.css';

const rootEl = document.getElementById('content');


const client = createApolloClient();

let initialState = {};

if (window.__APOLLO_STATE__) {
  initialState = window.__APOLLO_STATE__;
}

const store = createReduxStore(initialState, client);

if (module.hot) {
  module.hot.dispose(() => {
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
}

// Commented out ("let HTML app be HTML app!")
window.addEventListener('DOMContentLoaded', () => {
  const mountNode = document.getElementById('stylesheet');
  // const renderer = createRenderer(document.getElementById('font-stylesheet'));
  const renderer = createFelaRenderer(); 
  if (rootEl) {
    ReactDOM.render(
      <ApolloProvider store={store} client={client}>
        <ReactFela.Provider renderer={renderer}>
          <ReduxProvider store={store} >
            <Component />
          </ReduxProvider>
        </ReactFela.Provider>
      </ApolloProvider>
      , rootEl);
  }
});



