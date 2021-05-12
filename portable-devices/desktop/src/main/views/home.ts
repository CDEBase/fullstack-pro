/* eslint-disable no-use-before-define */
import { provide } from 'inversify-binding-decorators';
import { BrowserWindow, ipcMain } from 'electron';
import { createWindow } from '../utils';

@provide(HomeWindow)
export class HomeWindow {
    private window: BrowserWindow;

    constructor() {
        this.window = createWindow({ name: 'main-page', show: true, remote: true });
        // Object BrowserWindow has a lot of standart events
        // We will hide Tray window on blur. To emulate standart behavior of the tray-like apps.
        this.window.on('blur', () => {
            this.window.hide();
        });
        // Custom events MAIN WINDOW
        ipcMain.on('show-main-window-event', function () {
            if (this.window) {
                this.window.show();
            }
        });

    }

    show() {
        this.window.show();
    }

    close() {
        this.window.close();
        this.window = null;
    }
}
