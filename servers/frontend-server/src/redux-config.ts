/// <reference path='../../../typings/index.d.ts' />

import {
    createStore, Store, applyMiddleware, Middleware, AnyAction,
    GenericStoreEnhancer, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux';
import {
    reducers,
    Store as StoreState,
} from '@sample-stack/client-redux';
import modules from '@sample-stack/counter/lib/browser';

/**
 * Add middleware that required for this app.
 */
const middlewares: Middleware[] = [
    thunk,
];

const enhancers: () => GenericStoreEnhancer[] = () => [
    applyMiddleware(...middlewares),
];

const composeEnhancers: any = (process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const storeReducer = combineReducers<StoreState.Counter | StoreState.Sample>({
    router: routerReducer,
    ...reducers,
    ...modules.reducers,
});
/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = () => {
    const store: Store<StoreState.Counter | StoreState.Sample> =
        createStore<StoreState.Counter | StoreState.Sample>(
            storeReducer,
            {} as StoreState.Sample,
            composeEnhancers(...enhancers()),
        );
    return store;
};
