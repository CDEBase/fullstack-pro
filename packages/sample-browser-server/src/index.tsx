/// <reference path='../../../typings/index.d.ts' />


import * as React from 'react' // tslint:disable-line
import * as ReactDOM from 'react-dom'
import { createStore, Store, applyMiddleware, Middleware, GenericStoreEnhancer, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { addPersistedQueries } from 'persistgraphql';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

const settings = require('../../../package.json');
const queryMap = require('persisted_queries.json');

require('backend_reload');
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import {
  reducers,
  Store as StoreState,
} from '@sample/client-redux'

import { Counter, PersonList } from '@sample/client-react'
import './index.css';


const rootEl = document.getElementById('content');

let networkInterface = createNetworkInterface({
  uri: __EXTERNAL_BACKEND_URL__ || "/graphql",
});

const wsClient = new SubscriptionClient(window.location.origin.replace(/^http/, 'ws')
  .replace(':' + settings.webpackDevPort, ':' + settings.apiPort));

networkInterface = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);


// if (__PERSIST_GQL__) {
//   networkInterface = addPersistedQueries(networkInterface, queryMap);
// }

const client = new ApolloClient({
  networkInterface: addPersistedQueries(networkInterface, queryMap)
});

const middlewares: Middleware[] = [
  thunk,
  client.middleware(),
];


const enhancers: GenericStoreEnhancer[] = [
  applyMiddleware(...middlewares),
];

const ReduxExtentionComposeName: string = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';



const composeEnhancers =
  window[ReduxExtentionComposeName] ?
    window[ReduxExtentionComposeName] : compose;

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
  if (rootEl) ReactDOM.render(
    <ApolloProvider store={store} client={client}>
      <div>
        <div>
          <h2>Redux Counter Test</h2>
          <Counter label='count:' />
        </div>
        <div>
          <h2>Apollo Graphql Test </h2>
          <PersonList />
        </div>
      </div>
    </ApolloProvider>
    , rootEl)
})


