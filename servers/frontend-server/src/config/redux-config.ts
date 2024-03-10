/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import { createEnhancer, reducer } from 'redux-data-router';
import { persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import { REDUX_PERSIST_KEY } from '@common-stack/client-core';
import { createReduxStore as createBaseReduxStore } from './base-redux-config';
import modules, { logger } from '../modules';
import { rootEpic, epic$ } from './epic-config';

export const epicMiddlewareFunc = (apolloClient, services, container) =>
    createEpicMiddleware({
        dependencies: {
            apolloClient,
            routes: modules.getConfiguredRoutes(),
            services,
            container,
            logger,
        },
    });
let __CLIENT_REDUX_STORE__;

export const persistConfig = {
    key: REDUX_PERSIST_KEY,
    storage,
    stateReconciler: autoMergeLevel2,
    transforms: modules.reduxPersistStateTransformers,
};

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = (apolloClient, services, container, router) => {
    const reducers = {
        router: reducer,
        ...modules.reducers,
    };

    let store;
    if ((module as any).hot && (module as any).hot.data && (module as any).hot.data.store) {
        // console.log('Restoring Redux store:', JSON.stringify((module as any).hot.data.store.getState()));
        store = (module as any).hot.data.store;
        // replace the reducers always as we don't have ablity to find
        // new reducer added through our `modules`
        store.replaceReducer(persistReducer(persistConfig, combineReducers(reducers)));
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
            middleware: [thunkMiddleware],
            enhancers: [createEnhancer(router)],
            epicMiddleware: epicMiddlewareFunc(apolloClient, services, container),
            rootEpic: rootEpic as any,
            reducers,
        });
    }
    if (container.isBound('ReduxStore')) {
        container
            .rebind('ReduxStore')
            .toDynamicValue(() => store)
            .inRequestScope();
    } else {
        container
            .bind('ReduxStore')
            .toDynamicValue(() => store)
            .inRequestScope();
    }
    return { store };
};
