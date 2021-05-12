import storage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createReduxStore as createBaseReduxStore } from './base-redux-config';

// import { rootEpic } from './epic-config';

import history from './router-history';

export { history };

export const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['user'],
};

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = () => {
    // middleware
    const router = connectRouter(history);

    const store = createBaseReduxStore({
        scope: 'browser',
        isDebug: true,
        isDev: process.env.NODE_ENV === 'development',
        history,
        initialState: {},
        persistConfig,
        middleware: [routerMiddleware(history)],
        // epicMiddleware,
        // preMiddleware: [forwardToMain],
        // rootEpic,
        reducers: { router },
    });

    return store;
};
