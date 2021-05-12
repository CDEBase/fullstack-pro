/* eslint-disable no-use-before-define */
import { provide } from 'inversify-binding-decorators';
import { BrowserWindow, ipcMain } from 'electron';
import Positioner from 'electron-positioner';
import { createWindow } from '../utils';

@provide(AboutWindow)
export class AboutWindow {
    private window: BrowserWindow;

    constructor() {
        this.window = createWindow({ name: 'about-page', height: 50, width: 50, remote: true });
        // Object BrowserWindow has a lot of standart events
        // We will hide Tray window on blur. To emulate standart behavior of the tray-like apps.
        this.window.on('blur', () => {
            this.window.hide();
        });

        // On show - we should display About Window in the center of the screen.
        this.window.on('show', () => {
            const positioner = new Positioner(this.window);
            positioner.move('center', null);
        });

        ipcMain.on('about-window', function () {
            this.window.show();
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
