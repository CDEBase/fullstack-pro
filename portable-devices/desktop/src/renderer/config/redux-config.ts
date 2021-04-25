/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import modules from '../modules';
import { createClientContainer } from './client.service';
import { rootEpic } from './epic-config';
import { createReduxStore as createBaseReduxStore } from './base-redux-config';

export const history = require('./router-history');

const { apolloClient, services } = createClientContainer();
export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
    },
});

export const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    // Don't add `user` state to persist as it creates problems.
    whitelist: [],
};

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = (scope = 'main', url = '/') => {
    // only in server side, url will be passed.
    const newHistory = __CLIENT__ ? history : history(url);

    // middleware
    const router = connectRouter(newHistory);

    // If we have preloaded state, save it.
    const initialState = __CLIENT__
        ? scope === 'renderer'
            ? getInitialStateRenderer()
            : { ...window.__PRELOADED_STATE__ }
        : {};
    const isBrowser = __CLIENT__ ? 'browser' : 'server';
    const store = createBaseReduxStore({
        scope: isBrowser,
        isDebug: __DEBUGGING__,
        isDev: process.env.NODE_ENV === 'development',
        history: newHistory,
        initialState,
        persistConfig,
        middleware: [routerMiddleware(newHistory)],
        epicMiddleware,
        preMiddleware: [forwardToMain],
        rootEpic,
        reducers: { router, ...modules.reducers },
    });

    // Delete it once we have it stored in a variable
    if (__CLIENT__) {
        delete window.__PRELOADED_STATE__;
        // electron
        replayActionRenderer(store);
    }
    return store;
};
