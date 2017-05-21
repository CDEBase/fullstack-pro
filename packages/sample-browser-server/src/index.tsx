import * as React from 'react' // tslint:disable-line
import * as ReactDOM from 'react-dom'
import { createStore, Store, applyMiddleware, Middleware, GenericStoreEnhancer, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { ApolloClient, createNetworkInterface, graphql, ApolloProvider } from 'react-apollo';
import {
  reducers,
  Store as StoreState,
} from '@sample/client-redux'
import gql from 'graphql-tag';

import { Counter, PersonList } from '@sample/client-react'
import './index.css';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql'
});
import { pure, compose as comCompose, flattenProp } from 'recompose';

const client = new ApolloClient({
  networkInterface: networkInterface
});

const middlewares: Middleware[] = [
  thunk,
  client.middleware(),
  // logicMiddleware,
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
  const rootEl = document.getElementById('redux-app-root')
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


