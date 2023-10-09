import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import createChromeStorage from 'redux-persist-chrome-storage';
import thunkMiddleware from 'redux-thunk';
import { createReduxStore as createBaseReduxStore } from '../base-redux-config';
import modules, { logger, container } from '../../modules/popup';
import { rootEpic } from './epic-config';
import { history } from '../router-history';
import { createClientContainer } from './client.service';

export { history };
const { apolloClient, services } = createClientContainer();
const storage = createChromeStorage(window.chrome, 'sync');

export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        apolloClient,
        routes: modules.getConfiguredRoutes(),
        services,
        container,
        logger,
    },
});

export const persistConfig = {
    key: 'root',
    storage,
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
        isDebug: __DEBUGGING__,
        isDev: process.env.NODE_ENV === 'development',
        initialState: {},
        persistConfig,
        epicMiddleware,
        rootEpic: rootEpic as any,
        middleware: [thunkMiddleware, routerMiddleware(history)],
        reducers: { router, ...modules.reducers },
    });
    container.bind('ReduxStore').toConstantValue(store);
    return store;
};
