import { app, protocol } from 'electron';
import { dev } from 'electron-is';

import { createLogProxy } from '../common';
import { getLogger } from './utils';
import { loadContainerAsync } from './ioc';
import { createClientContainer } from './config/client.service';
import { App } from './app';
import { createReduxStore } from './config/redux-electron-config';

/**
 * Operation before initialization
 */
const beforeInit = async () => {
    // Registration Agreement
    protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

    // control singleton
    const isSingle = app.requestSingleInstanceLock();
    if (!isSingle) {
        app.exit(0);
    }

    // Replace error logger
    if (!dev()) {
        console.error = createLogProxy('error', getLogger('error'))(console.error);
    }

    // Initialize the database part
    await loadContainerAsync();
};

/**
 * Start method
 */
export const bootstrap = async () => {
    await beforeInit();
    const { container } = createClientContainer();
    container.get(App);
    createReduxStore();
};
