/* eslint-disable no-use-before-define */
import { provide } from 'inversify-binding-decorators';
import { BrowserWindow, ipcMain } from 'electron';
import Positioner from 'electron-positioner';
import { ElectronTypes } from '@common-stack/client-core';
import { createWindow } from '../utils';
import { IPC_EVENTS } from '../../common';

@provide(ElectronTypes.AboutWindow)
export class AboutWindow {
    private window: BrowserWindow;

    constructor() {
        this.window = createWindow({ name: 'about-page', height: 250, width: 300, remote: true });
        // Object BrowserWindow has a lot of standart events
        // We will hide Tray window on blur. To emulate standart behavior of the tray-like apps.
        this.window.on('blur', () => {
            this.window.hide();
        });

        // On show - we should display About Window in the center of the screen.
        this.window.on('show', () => {
            const positioner = new Positioner(this.window);
            (positioner as any).move('center');
        });

        ipcMain.on(IPC_EVENTS.SHOW_ABOUT, () => {
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
