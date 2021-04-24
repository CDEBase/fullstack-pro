/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import {
    createStore,
    Store,
    applyMiddleware,
    Middleware,
    AnyAction,
    compose,
    combineReducers,
    StoreEnhancer,
} from 'redux';
import {
    forwardToMain,
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
    replayActionRenderer,
    getInitialStateRenderer,
} from 'electron-redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import modules from '../modules';
import { createClientContainer } from './client.service';
import { rootEpic } from './epic-config';

export const history = require('./router-history');

const { apolloClient, services } = createClientContainer();
export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
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
    // Don't add `user` state to persist as it creates problems.
    whitelist: [],
};

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */

export const createReduxStore = (scope = 'main', url = '/') => {
    // only in server side, url will be passed.
    const newHistory = __CLIENT__ ? history : history(url);
    /**
     * Add middleware that required for this app.
     */

    const router = routerMiddleware(newHistory);
    let middlewares: Middleware[] = [
        thunk,
        // routerMiddleware(newHistory),
        router,
        epicMiddleware, // epic middleware
    ];

    // Add redux logger during development only
    if ((process.env.NODE_ENV === 'development' || __DEBUGGING__) && __CLIENT__) {
        const { createLogger } = require('redux-logger');

        middlewares.push(
            createLogger({
                level: scope === 'main' ? undefined : 'info',
                collapsed: true,
            }),
        );
    }

    // this one code belongs to the electron-redux
    console.log('----SCOPE====', scope);
    if (scope === 'renderer') {
        middlewares = [forwardToMain, router, ...middlewares];
    }

    if (scope === 'main') {
        middlewares = [triggerAlias, ...middlewares, forwardToRenderer];
    }

    const enhancers: () => StoreEnhancer<any>[] = () => [applyMiddleware(...middlewares)];

    const composeEnhancers: any =
        ((process.env.NODE_ENV === 'development' || __DEBUGGING__) &&
            __CLIENT__ &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
        compose;

    const rootReducer: any = storeReducer(newHistory);
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    // If we have preloaded state, save it.
    const initialState = __CLIENT__
        ? scope === 'renderer'
            ? getInitialStateRenderer()
            : { ...window.__PRELOADED_STATE__ }
        : {};

    // Delete it once we have it stored in a variable
    if (__CLIENT__) {
        delete window.__PRELOADED_STATE__;
    }

    const store: any = createStore(persistedReducer, initialState, composeEnhancers(...enhancers()));
    if (__CLIENT__) {
        // no SSR for now
        epicMiddleware.run(rootEpic as any);
    }

    if (scope === 'main') {
        replayActionMain(store);
    } else if (scope === 'renderer') {
        replayActionRenderer(store);
    }

    return store;
};
