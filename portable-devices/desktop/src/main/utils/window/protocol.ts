import { protocol, BrowserWindow } from 'electron';
import { dev } from 'electron-is';
import { format as formatUrl } from 'url';
import createProtocol from '../createProtocol';
import { config } from '../../../config';

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

/**
 * Load address path
 * @param windows window
 * @param name path name in renderer
 */
export const loadUrl = (windows: BrowserWindow, name: string) => {
    if (dev()) {
        const htmlDevPath = formatUrl({
            protocol: 'http',
            slashes: true,
            hostname: config.ELECTRON_WEBPACK_WDS_HOST,
            port: config.ELECTRON_WEBPACK_WDS_PORT,
            pathname: `${name}.html`,
        });
        windows.loadURL(htmlDevPath);
    } else {
        createProtocol('app');
        windows.loadURL(`app://./${name}.html`);
    }
};
