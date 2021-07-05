/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { forwardToMain, replayActionRenderer, forwardToMainWithParams, getInitialStateRenderer } from 'electron-redux';
import { createEpicMiddleware } from 'redux-observable';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import modules from '../../modules/tray';
import { createClientContainer } from './client.service';
import { isDev } from '../../../common';
import { rootEpic } from './epic-config';
import { createReduxStore as createBaseReduxStore } from '../../../common/config/base-redux-config';

export const history = require('../router-history');

const { apolloClient, container, services, logger } = createClientContainer();
export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
        container,
        logger,
    },
});

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = () => {
    // middleware
    const router = connectRouter(history);

    // If we have preloaded state, save it.
    const store = createBaseReduxStore({
        scope: 'browser',
        isDebug: __DEBUGGING__,
        isDev,
        history,
        initialState: {},
        middleware: [routerMiddleware(history)],
        // epicMiddleware,
        preMiddleware: [forwardToMain],
        // rootEpic,
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
