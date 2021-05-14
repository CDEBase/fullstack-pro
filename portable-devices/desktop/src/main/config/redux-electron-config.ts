import { triggerAlias, replayActionMain, forwardToRenderer } from 'electron-redux';
import { createEpicMiddleware } from 'redux-observable';
import modules from '../modules';
import { createReduxStore as createBaseReduxStore } from '../../common/config/base-redux-config';
import { rootEpic } from './epic-config';
import { isDev } from '../../common';
import container from '../ioc';

export const epicMiddleware = createEpicMiddleware({
    dependencies: {
        routes: modules.getConfiguredRoutes(),
        container,
    },
});

/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = () => {
    const store = createBaseReduxStore({
        scope: 'ElectronMain',
        isDebug: __DEBUGGING__,
        isDev,
        initialState: {},
        epicMiddleware,
        rootEpic,
        middleware: [triggerAlias],
        postMiddleware: [forwardToRenderer],
        reducers: modules.reducers,
    });

    replayActionMain(store);
    return store;
};
