// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createReduxStore as createBaseReduxStore } from '../base-redux-config';
import modules, { logger, container } from '../../modules/popup';
import { rootEpic } from './epic-config';
import { createClientContainer } from './client.service';
 
import { history } from '../router-history';

export { history };
const { apolloClient, services } = createClientContainer();

export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
        container,
        logger,
    },
});

// export const persistConfig = {
//     key: 'root',
//     storage,
//     stateReconciler: autoMergeLevel2,
//     whitelist: ['user'],
// };

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = () => {
    // middleware
    const router = connectRouter(history);

    const store = createBaseReduxStore({
        scope: 'browser',
        isDebug: process.env.NODE_ENV !== 'production',
        isDev: process.env.NODE_ENV === 'development',
        initialState: {},
        // persistConfig,
        middleware: [routerMiddleware(history)],
        epicMiddleware,
        rootEpic: rootEpic as any,
        reducers: { router, ...modules.reducers },
    });

    return store;
};
