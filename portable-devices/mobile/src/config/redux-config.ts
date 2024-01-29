import storage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { REDUX_PERSIST_KEY } from '@common-stack/client-core';
import { createReduxStore as createBaseReduxStore } from './base-redux-config';
import modules, { logger } from '../modules';
import { rootEpic } from './epic-config';
import history from './router-history';

export { history };

export const epicMiddlewareFunc = (apolloClient, services, container) =>
    createEpicMiddleware({
        dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
        container,
        logger,
        config: {
            loadRoot: true,
        },
    },
});

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
export const createReduxStore = (history, apolloClient, services, container) => {
    // middleware
    const router = connectRouter(history);

    const store = createBaseReduxStore({
        scope: 'browser',
        isDebug: __DEBUGGING__,
        isDev: process.env.NODE_ENV === 'development',
        initialState: {},
        persistConfig,
        middleware: [routerMiddleware(history)],
        epicMiddleware: epicMiddlewareFunc(apolloClient, services, container),
        rootEpic: rootEpic as any,
        reducers: { router, ...modules.reducers },
    });
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
