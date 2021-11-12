/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import { createReduxStore as createBaseReduxStore } from './base-redux-config';
import modules, { logger } from '../modules';
import { createClientContainer } from './client.service';
import { rootEpic, epic$ } from './epic-config';

const history = require('./router-history');

const { apolloClient, container, services } = createClientContainer();

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
    transforms: modules.reduxPersistStateTransformers,
};

export const storeReducer = (hist) =>
    combineReducers({
        router: connectRouter(hist),
        ...modules.reducers,
    });

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = (url = '/') => {
    // only in server side, url will be passed.
    const newHistory = __CLIENT__ ? history : history(url);
    // middleware
    const router = connectRouter(newHistory);

    let store;
    if ((module as any).hot && (module as any).hot.data && (module as any).hot.data.store) {
        // console.log('Restoring Redux store:', JSON.stringify((module as any).hot.data.store.getState()));
        store = (module as any).hot.data.store;
        // replace the reducers always as we don't have ablity to find
        // new reducer added through our `modules`
        store.replaceReducer(
            persistReducer(persistConfig, storeReducer((module as any).hot.data.history || newHistory)),
        );
        // store.replaceReducer(storeReducer((module as any).hot.data.history || history));
    } else {
        // If we have preloaded state, save it.
        const initialState = __CLIENT__
            ? { ...window.__PRELOADED_STATE__ } // #952 TODO we need cookie to have id_token for SSR to work properly
            : {};
        // Delete it once we have it stored in a variable
        if (__CLIENT__) {
            delete window.__PRELOADED_STATE__;
        }
        store = createBaseReduxStore({
            scope: __CLIENT__ ? 'browser' : 'server',
            isDebug: true,
            isDev: process.env.NODE_ENV === 'development',
            initialState,
            persistConfig,
            middleware: [thunkMiddleware, routerMiddleware(newHistory)],
            epicMiddleware,
            rootEpic: rootEpic as any,
            reducers: { router, ...modules.reducers },
        });
    }
    if ((module as any).hot) {
        (module as any).hot.dispose((data) => {
            // console.log("Saving Redux store:", JSON.stringify(store.getState()));
            data.store = store;
            data.history = history;
        });
        (module as any).hot.accept('../config/epic-config', () => {
            // we may need to reload epic always as we don't
            // know whether it is updated using our `modules`
            const nextRootEpic = require('./epic-config').rootEpic;
            // First kill any running epics
            store.dispatch({ type: 'EPIC_END' });
            // Now setup the new one
            epic$.next(nextRootEpic);
        });
    }
    container.bind('ReduxStore').toConstantValue(store);
    return { store, history };
};
