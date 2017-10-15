/// <reference path='../../../typings/index.d.ts' />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, Store, applyMiddleware, Middleware, GenericStoreEnhancer, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
// import { addPersistedQueries } from 'persistgraphql';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import * as ReactFela from 'react-fela';
import createRenderer from './fela-renderer';

import { app as settings } from '../../../app.json';

// const queryMap = require('persisted_queries.json');

require('backend_reload');

import { ApolloClient, createNetworkInterface, ApolloProvider, NetworkInterface } from 'react-apollo';
import {
  reducers,
  Store as StoreState,
} from '@sample-stack/client-redux';

import { Counter, PersonList, CounterWithApollo } from '@sample-stack/client-react';
import './index.css';


const rootEl = document.getElementById('content');

const SERVER_PORT = process.env.GRAPHQL_SERVER_PORT || settings.apiPort;
const CLIENT_PORT = process.env.GRAPHQL_CLIENT_PORT || settings.webpackDevPort;
const GRAPHQL_URL = process.env.GRAPHQL_URL || __EXTERNAL_BACKEND_URL__;

const networkInterface = createNetworkInterface({
  uri: GRAPHQL_URL || '/graphql',
});

const wsClient: NetworkInterface = new SubscriptionClient(
  (GRAPHQL_URL || (window.location.origin + '/graphql'))
    .replace(/^http/, 'ws')
    .replace(':' + CLIENT_PORT, ':' + SERVER_PORT), {
    reconnect: true,
  }) as NetworkInterface;

// Hybrid WebSocket Transport
// https://github.com/apollographql/subscriptions-transport-ws#hybrid-websocket-transport
// let networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   networkInterface,
//   wsClient,
// );



// if (__PERSIST_GQL__) {
//   networkInterfaceWithSubscriptions = addPersistedQueries(networkInterfaceWithSubscriptions, queryMap);
// }

// const client = new ApolloClient({
//   networkInterface,
// });

// For Full Websocket Transport
// https://github.com/apollographql/subscriptions-transport-ws#full-websocket-transport
const client = new ApolloClient({
  networkInterface: wsClient,
});

const middlewares: Middleware[] = [
  thunk,
  client.middleware(),
];


const enhancers: GenericStoreEnhancer[] = [
  applyMiddleware(...middlewares),
];

const REDUX_EXTENSION_COMPOSE_NAME: string = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';

const composeEnhancers =
  window[REDUX_EXTENSION_COMPOSE_NAME] ?
    window[REDUX_EXTENSION_COMPOSE_NAME] : compose;

const store = createStore(
  combineReducers({
    ...reducers,
    apollo: client.reducer(),
  }),
  {} as StoreState.Sample,
  composeEnhancers(...enhancers),
);

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



