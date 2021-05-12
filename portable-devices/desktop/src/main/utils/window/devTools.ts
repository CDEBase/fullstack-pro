/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { app } from 'electron';
import { dev } from 'electron-is';
import { logger } from '../logger';

/**
 * Load plug-in and developer tool window
 */
export const loadDevTools = () => {
    if (!(dev() || process.env.DEBUG === '1')) return;

    app.whenReady().then(() => {
        const {
            default: installExtension,

            // React Dev tools cannot be repaired temporarily (Electron version >= 9.0)
            // https://github.com/electron/electron/issues/23662
            // REACT_DEVELOPER_TOOLS
            REDUX_DEVTOOLS,
        } = require('electron-devtools-installer');

        const extensions = [
            // REACT_DEVELOPER_TOOLS,
            REDUX_DEVTOOLS,
        ];

        try {
            installExtension(extensions).then((name: string) => {
                logger.trace(`Added Extension: ${name}`);
            });
        } catch (e) {
            logger.error('An error occurred: ', e);
        }
    });
};
