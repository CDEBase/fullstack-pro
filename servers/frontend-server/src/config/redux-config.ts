import "reflect-metadata";
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import { createRouterReducer, createRouterMiddleware } from '@common-stack/remix-router-redux';
import { persistReducer } from 'redux-persist';
import { REDUX_PERSIST_KEY } from '@common-stack/client-core';
import { createReduxStore as createBaseReduxStore } from './base-redux-config';
import modules, { logger } from '../modules';
import { rootEpic } from './epic-config';

export const epicMiddlewareFunc = (apolloClient: any, services: any, container: any) =>
    createEpicMiddleware({
        dependencies: {
            apolloClient,
            routes: modules.getConfiguredRoutes(),
            services,
            container,
            logger,
            config: {
                loadRoot: false,
            }
        },
    });

export const persistConfig = {
    key: REDUX_PERSIST_KEY,
    storage,
    stateReconciler: autoMergeLevel2,
    transforms: modules.reduxPersistStateTransformers,
    blacklist: ['router']
};

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = (apolloClient: any, services: any, container: any) => {
    const reducers = {
        router: createRouterReducer({}),
        ...modules.reducers,
    };

    let store: any;
    if (import.meta.hot && import.meta.hot.data && import.meta.hot.data.store) {
        // console.log('Restoring Redux store:', JSON.stringify(import.meta.hot.data.store.getState()));
        store = import.meta.hot.data.store;
        // replace the reducers always as we don't have ablity to find
        // new reducer added through our `modules`
        store.replaceReducer(persistReducer(persistConfig, combineReducers(reducers) as any));
    } else {
        let initialState = {};
        let middlewares: any[] = [];
        if (__CLIENT__ && typeof window !== 'undefined') {
            initialState = { ...window.__PRELOADED_STATE__ }; // #952 TODO we need cookie to have id_token for SSR to work properly
            delete window.__PRELOADED_STATE__; // Delete it once we have it stored in a variable
            
            // it doesn't work, since __remixRouter is not created yet.
            // middlewares = [createRouterMiddleware({ router: window.__remixRouter } as any)]; 
        }
        store = createBaseReduxStore({
            scope: __CLIENT__ && typeof window !== 'undefined' ? 'browser' : 'server',
            isDebug: true,
            isDev: process.env.NODE_ENV === 'development',
            initialState,
            persistConfig,
            middleware: middlewares,
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
