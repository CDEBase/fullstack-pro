/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { createStore, applyMiddleware, Middleware, compose, combineReducers, StoreEnhancer } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import modules, { container } from '../modules';
import { createClientContainer } from './client.service';
import { rootEpic, epic$ } from './epic-config';

export const history = require('./router-history');

const { apolloClient, services, logger } = createClientContainer();

export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
        container,
        logger,
    },
});

export const storeReducer = (hist) =>
    combineReducers({
        router: connectRouter(hist),
        ...modules.reducers,
    });

export const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    transforms: modules.reduxPersistStateTransformers,
};

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = (url = '/') => {
    // only in server side, url will be passed.
    const newHistory = __CLIENT__ ? history : history(url);
    /**
     * Add middleware that required for this app.
     */
    const middlewares: Middleware[] = [
        thunk,
        routerMiddleware(newHistory),
        epicMiddleware, // epic middleware
    ];

    // Add redux logger during development only
    if ((process.env.NODE_ENV === 'development' || __DEBUGGING__) && __CLIENT__) {
        const { createLogger } = require('redux-logger');

        middlewares.push(createLogger({ collapsed: true }));
    }

    const enhancers: () => StoreEnhancer<any>[] = () => [applyMiddleware(...middlewares)];

    const composeEnhancers: any =
        ((process.env.NODE_ENV === 'development' || __DEBUGGING__) &&
            __CLIENT__ &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
        compose;

    const rootReducer = storeReducer(newHistory);
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    // If we have preloaded state, save it.
    const initialState = __CLIENT__
        ? { ...window.__PRELOADED_STATE__ } //#952 TODO we need cookie to have id_token for SSR to work properly
        : {};
    // Delete it once we have it stored in a variable
    if (__CLIENT__) {
        delete window.__PRELOADED_STATE__;
    }

    let store = createStore(rootReducer, initialState as any, composeEnhancers(...enhancers()));
    if (__CLIENT__) {
        // no SSR for now
        epicMiddleware.run(rootEpic as any);
    }

    if ((module as any).hot && (module as any).hot.data && (module as any).hot.data.store) {
        // console.log('Restoring Redux store:', JSON.stringify((module as any).hot.data.store.getState()));
        store = (module as any).hot.data.store;
        console.log('----SSROO', (module as any).hot.data.store);
        // replace the reducers always as we don't have ablity to find
        // new reducer added through our `modules`
        // store.replaceReducer(persistReducer(persistConfig, storeReducer((module as any).hot.data.history || history)));
        store.replaceReducer(storeReducer((module as any).hot.data.history || history));
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
    return store;
};
