/* eslint-disable no-use-before-define */
import { BrowserWindow, ipcMain } from 'electron';
import { ElectronTypes } from '@common-stack/client-core';
import * as path from 'path';
import { createWindow, provideSingleton } from '../utils';
import { IPC_EVENTS } from '../../common';

@provideSingleton(ElectronTypes.MainWindow)
export class MainWindow {
    private window: BrowserWindow;

    constructor() {
        this.startWindow();
    }

    private startWindow() {
        this.window = createWindow({
            name: 'main-page',
            show: true,
            remote: true,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                enableRemoteModule: true,
                // add preload to load esm
                preload: path.resolve(path.join(__dirname, 'preload.js')),
            },
        });
        this.window.on('close', (event) => {
            (event as any).sender.hide();
            event.preventDefault(); // prevent quit process
        });
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
