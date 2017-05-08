import * as React from 'react' // tslint:disable-line
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import {
  reducers,
  Store,
} from './reducers'

import { Counter } from './components/counter'
import './index.css';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql'
});

const client = new ApolloClient({
  networkInterface: networkInterface
});

let store: redux.Store<any> = redux.createStore(
  redux.combineReducers({
    reducers,
    apollo: client.reducer(),
  }),
  {} as Store.All,
  redux.applyMiddleware(thunk),
)

// Commented out ("let HTML app be HTML app!")
window.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('redux-app-root')
  if (rootEl) ReactDOM.render(
    <ApolloProvider store={store} client={client}>
      <Counter label='count:' />
    </ApolloProvider>
  , rootEl)
})
