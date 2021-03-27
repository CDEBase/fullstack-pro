const { createStore, applyMiddleware } = require('redux');
const {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
  createAliasedAction,
} = require('electron-redux');

import { connectedReactRouter_counter } from '../reducers'
import { increment,decrement } from '../actions'

// setup store
const initialState = getInitialStateRenderer();
const store = createStore(connectedReactRouter_counter, initialState, applyMiddleware(forwardToMain));

replayActionRenderer(store);

// set up renderer
function mount() {
  document.getElementById('app').innerHTML = `
    <p>
      Counter: <span id="value">0</span> 
      <button id="increment">+</button>
      <button id="decrement">-</button>
    </p>
  `;

  document.getElementById('increment').addEventListener('click', () => {
   store.dispatch(increment());
  });

  document.getElementById('decrement').addEventListener('click', () => {
    store.dispatch(decrement());
  });

//   document.getElementById('incrementAliased').addEventListener('click', () => {
//     store.dispatch(createAliasedAction('INCREMENT_ALIASED', () => ({ type: 'INCREMENT' }))());
//   });
}

function renderValue() {
  document.getElementById('value').innerHTML = store.getState().toString();
}

mount();
renderValue();

store.subscribe(renderValue);

