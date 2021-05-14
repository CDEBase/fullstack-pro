/* eslint-disable no-use-before-define */
import { BrowserWindow, ipcMain } from 'electron';
import { ElectronTypes } from '@common-stack/client-core';
import { createWindow, provideSingleton } from '../utils';
import { IPC_EVENTS } from '../../common';

@provideSingleton(ElectronTypes.MainWindow)
export class MainWindow {
    private window: BrowserWindow;

    constructor() {
        this.window = createWindow({ name: 'main-page', show: true, remote: true });
        // Custom events MAIN WINDOW
        ipcMain.on(IPC_EVENTS.SHOW_MAIN, function () {
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
