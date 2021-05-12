import { BrowserWindow } from 'electron';
import { loadDevTools } from './devTools';
import { loadUrl } from './protocol';

export interface WindowOpts {
    /**
     * URL
     */
    name: string;
    title?: string;
    show?: boolean;
    width?: number;
    height?: number;
    devTools?: boolean;
    /**
     * Allow renderer to use remote module
     */
    remote?: boolean;
}

export const createWindow = (opts: WindowOpts) => {
    const { name, title, width, height, devTools, remote, show = false } = opts;
    const windows = new BrowserWindow({
        show,
        width,
        height,
        title,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: remote,
            // Context isolation environment
            // https://www.electronjs.org/docs/tutorial/context-isolation
            contextIsolation: false,
            // devTools: isDev,
        },
    });

    loadUrl(windows, name);

    loadDevTools();

    // Show devtools and open it
    if (devTools) {
        windows.webContents.openDevTools();
    }
    return windows;
};
