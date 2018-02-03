/// <reference path='../../../typings/index.d.ts' />

import {
    createStore, Store, applyMiddleware, Middleware, AnyAction,
    GenericStoreEnhancer, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import {
    reducers,
    Store as StoreState,
} from '@sample-stack/client-redux';

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
    ...reducers,
});
/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = (initialStat) => {
    const store: Store<StoreState.Counter | StoreState.Sample> =
        createStore<StoreState.Counter | StoreState.Sample>(
            storeReducer,
            {} as StoreState.Sample,
            composeEnhancers(...enhancers()),
        );
    return store;
};
