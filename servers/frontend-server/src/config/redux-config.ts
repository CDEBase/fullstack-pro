/// <reference path='../../../../typings/index.d.ts' />

import {
    createStore, Store, applyMiddleware, Middleware, AnyAction,
    compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import {
    reducers,
    Store as StoreState,
} from '@sample-stack/client-redux';
import modules from '../modules';

export const history = require('./router-history');

/**
 * Add middleware that required for this app.
 */
const middlewares: Middleware[] = [
    routerMiddleware(history),
    thunk,
];

const enhancers = () => [
    applyMiddleware(...middlewares),
];

const composeEnhancers: any = (
    (process.env.NODE_ENV === 'development' || __DEBUGGING__) &&
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
        createStore<StoreState.Counter | StoreState.Sample, any, any, any>(
            storeReducer,
            {} as StoreState.Sample,
            composeEnhancers(...enhancers()),
        );
    return store;
};
