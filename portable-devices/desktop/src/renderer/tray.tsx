/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ipcRenderer } from 'electron';
import { toInteger } from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer, createAliasedAction } from 'electron-redux';
import { connectedReactRouter_counter } from '../reducers';

import { increment, decrement } from '../actions';

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
      <button id="notify">Click</button>
    </p>
  `;

    document.getElementById('increment').addEventListener('click', () => {
        store.dispatch(increment());
        const current_count: string = (toInteger(document.getElementById('value').innerHTML) + 1).toString();
        ipcRenderer.send('update-title-tray-window-event', current_count);
    });

    document.getElementById('decrement').addEventListener('click', () => {
        store.dispatch(decrement());
        const current_count: string = (toInteger(document.getElementById('value').innerHTML) - 1).toString();
        ipcRenderer.send('update-title-tray-window-event', current_count);
    });

    document.getElementById('notify').addEventListener('click', () => {
        // var current_count:String = document.getElementById('value').innerHTML;
        const notif = new window.Notification('My First Notification', {
            body: 'Body of Notification',
        });
        notif.onclick = function () {
            ipcRenderer.send('show-about-window-event');
        };
    });
}

function renderValue() {
    document.getElementById('value').innerHTML = store.getState().toString();
}

mount();
renderValue();

store.subscribe(renderValue);
