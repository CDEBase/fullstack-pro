/// <reference path='../../../typings/index.d.ts' />
///<reference types="webpack-env" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactFela from 'react-fela';
import { ApolloProvider } from 'react-apollo';
import createRenderer from './fela-renderer';
import { createApolloClient } from './apollo-client';
import { createReduxStore } from './redux-config';
import { app as settings } from '../../../app.json';


require('backend_reload');

import {
  reducers,
  Store as StoreState,
} from '@sample-stack/client-redux';

import { Counter, PersonList, CounterWithApollo } from '@sample-stack/client-react';
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
  const renderer = createRenderer(document.getElementById('font-stylesheet'));
  if (rootEl) {
    ReactDOM.render(
      <ReactFela.Provider renderer={renderer} mountNode={mountNode}>
        <ApolloProvider store={store} client={client}>
          <div>
            <div>
              <h2>Redux Counter Test</h2>
              <Counter label="count:" />
            </div>
            <div>
              <h2>Apollo Graphql Test </h2>
              <CounterWithApollo />
              <PersonList />
            </div>
          </div>
        </ApolloProvider>
      </ReactFela.Provider>
      , rootEl);
  }
});



