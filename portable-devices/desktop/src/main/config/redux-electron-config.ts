import { triggerAlias, replayActionMain, forwardToRenderer } from 'electron-redux';
import storage from 'redux-persist/lib/storage';
import { createEpicMiddleware } from 'redux-observable';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import modules from '../modules';
import { createReduxStore as createBaseReduxStore } from '../../renderer/config/base-redux-config';
import { rootEpic } from '../../renderer/config/epic-config';
import { isDev } from '../../common';

export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        routes: modules.getConfiguredRoutes(),
        lazyServices: () => modules.createService({}, {}),
    },
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
export const createReduxStore = () => {
    // only in server side, url will be passed.
    const newHistory = {};
    // If we have preloaded state, save it.
    const initialState = {};
    // const router = connectRouter(newHistory);
    const store = createBaseReduxStore({
        scope: 'server',
        isDebug: __DEBUGGING__,
        isDev,
        history: newHistory as any,
        initialState,
        epicMiddleware,
        rootEpic,
        // persistConfig,
        middleware: [triggerAlias],
        postMiddleware: [forwardToRenderer],
        reducers: modules.reducers,
    });

    replayActionMain(store);
    return store;
};
