/* eslint-disable no-underscore-dangle */
/* eslint-disable jsonc/indent */
import 'reflect-metadata';
import { applyMiddleware, createStore } from 'redux';
import { alias, wrapStore } from 'webext-redux';
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { history } from './config/router-history';
import modules from './modules/popup';
import { createReduxStore } from './config/popup/redux-config';

export function rootReducer(state, action) {
    switch (action.type) {
        case 'MY_ACTION':
            return Object.assign({}, ...state, {
                lastTabId: action._sender.tab.id,
            });
        default:
            return state;
    }
}
