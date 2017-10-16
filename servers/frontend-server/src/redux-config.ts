/// <reference path='../../../typings/index.d.ts' />

import { createStore, Store, applyMiddleware, Middleware, GenericStoreEnhancer, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { ApolloClient, ApolloStore } from 'react-apollo';
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

const enhancers: (apolloMiddleware) => GenericStoreEnhancer[] = (apolloMiddleware) => [
    applyMiddleware(...middlewares, apolloMiddleware),
];

const composeEnhancers: any = (process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
const createReduxStore = (initialState, client: ApolloClient) => {
    const store: Store<StoreState.Counter | StoreState.Sample | ApolloStore> =
        createStore<StoreState.Counter | StoreState.Sample | ApolloStore>(
            combineReducers({
                ...reducers,
                apollo: client.reducer(),
            }),
            {} as StoreState.Sample,
            composeEnhancers(...enhancers(client.middleware())),
        );
    return store;
};

export { createReduxStore };
