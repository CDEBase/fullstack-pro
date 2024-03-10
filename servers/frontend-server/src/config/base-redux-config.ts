// version 11/12/2021
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
import { configureStore, combineReducers, Tuple } from '@reduxjs/toolkit';
import { EpicMiddleware, Epic } from 'redux-observable';
import { persistReducer, PersistConfig } from 'redux-persist';

interface IReduxStore<S = any> {
    scope: 'browser' | 'server' | 'native' | 'ElectronMain';
    isDebug: boolean;
    isDev: boolean;
    reducers: any; // Use slices for reducers when using Redux Toolkit
    enhancers?: any[];
    rootEpic?: Epic;
    epicMiddleware?: EpicMiddleware<any, any, S, any>;
    preMiddleware?: any[];
    postMiddleware?: any[];
    middleware?: any[];
    initialState?: S;
    persistConfig?: PersistConfig<S>;
}
/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = ({
    scope,
    isDebug,
    isDev,
    reducers,
    rootEpic,
    enhancers = [],
    epicMiddleware,
    preMiddleware = [],
    postMiddleware = [],
    middleware = [],
    initialState,
    persistConfig,
}: IReduxStore<any>) => {
    const isBrowser = scope === 'browser';
    const isElectronMain = scope === 'ElectronMain';

    const rootReducer = combineReducers(reducers);
    const persistedReducer = persistConfig && isBrowser ? persistReducer(persistConfig, rootReducer) : rootReducer;

    /**
     * Add middleware that required for this app.
     */

    // Configure middlewares
    const middlewares = [
        ...preMiddleware,
        ...(epicMiddleware ? [epicMiddleware] : []),
        ...middleware,
        ...postMiddleware,
    ];

    const store = configureStore({
        reducer: persistedReducer as any,
        middleware: () => new Tuple(...middlewares),

        devTools: isDev || isDebug,
        preloadedState: initialState,
        enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(...enhancers),
    });

    if ((isBrowser || isElectronMain || __SSR__) && epicMiddleware && rootEpic) {
        epicMiddleware.run(rootEpic);
    }

    return store;
};
