/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
import {
    createStore,
    combineReducers,
    applyMiddleware,
    StoreEnhancer,
    Middleware,
    compose,
    Action,
    ReducersMapObject,
    PreloadedState,
} from 'redux';
import { EpicMiddleware, Epic } from 'redux-observable';
import { History } from 'history';
import { persistReducer, PersistConfig } from 'redux-persist';

const getStoreReducer = (reducers: ReducersMapObject) =>
    combineReducers({
        ...reducers,
    });

interface IReduxStore<S> {
    history: History;
    scope: 'browser' | 'server' | 'native';
    isDebug: boolean;
    isDev: boolean;
    reducers: ReducersMapObject<S>;
    rootEpic?: Epic<Action<S>, Action<any>, void, any>;
    epicMiddleware?: EpicMiddleware<Action<S>, Action<any>>;
    preMiddleware?: Middleware[];
    postMiddleware?: Middleware[];
    middleware?: Middleware[];
    initialState: PreloadedState<S>;
    persistConfig?: PersistConfig<S, any>;
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
    epicMiddleware,
    preMiddleware,
    postMiddleware,
    middleware,
    history,
    initialState,
    persistConfig,
}: IReduxStore<any>) => {
    const isBrowser = scope === 'browser';
    /**
     * Add middleware that required for this app.
     */

    const middlewares: Middleware[] = [];
    // add epicMiddleware
    if (epicMiddleware) {
        middlewares.push(epicMiddleware);
    }
    if (preMiddleware) {
        middlewares.unshift(...preMiddleware);
    }
    // Add redux logger during development only
    if ((isDev || isDebug) && isBrowser) {
        const { createLogger } = require('redux-logger');

        middlewares.push(
            createLogger({
                level: 'info',
                collapsed: true,
            }),
        );
    }

    if (middleware) {
        middlewares.push(...middleware);
    }

    if (postMiddleware) {
        middlewares.push(...postMiddleware);
    }

    const enhancers: () => StoreEnhancer<any>[] = () => [applyMiddleware(...middlewares)];

    const composeEnhancers: any =
        ((isDev || isDebug) && isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    const rootReducer = getStoreReducer(reducers);
    const persistedReducer = persistConfig ? persistReducer(persistConfig, rootReducer) : rootReducer;

    const store = createStore(persistedReducer, initialState, composeEnhancers(...enhancers()));
    if (isBrowser) {
        // no SSR for now
        if (epicMiddleware) {
            epicMiddleware.run(rootEpic);
        }
    }

    return store;
};
