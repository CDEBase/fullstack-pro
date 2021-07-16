/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { forwardToMain, replayActionRenderer, forwardToMainWithParams } from 'electron-redux';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import modules from '../../modules/main';
import { createClientContainer } from './client.service';
import { rootEpic } from './epic-config';
import { createReduxStore as createBaseReduxStore } from '../../../common/config/base-redux-config';
import { isDev } from '../../../common';

export const history = require('../router-history');

const { apolloClient, services, container, logger } = createClientContainer();
export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
        container,
        logger,
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
export const createReduxStore = () => {
    // middleware
    const router = connectRouter(history);

    const store = createBaseReduxStore({
        scope: 'browser',
        isDebug: __DEBUGGING__,
        isDev,
        history,
        initialState: {},
        persistConfig,
        middleware: [routerMiddleware(history)],
        epicMiddleware,
        preMiddleware: [
            forwardToMainWithParams({
                blacklist: [/^@@/, /^redux-form/, /^contribution/, /^command/],
            }),
        ],
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
