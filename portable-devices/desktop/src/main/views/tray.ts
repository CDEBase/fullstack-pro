/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import { BrowserWindow, ipcMain, Tray } from 'electron';
import { ElectronTypes } from '@common-stack/client-core';
import * as path from 'path';
import { createWindow, provideSingleton } from '../utils';
import { isDev } from '../../common';

import { IPC_EVENTS } from '../../common';

const iconPath = path.join(__dirname, '../../assets/icons/16x16.png');

@provideSingleton(ElectronTypes.TrayWindow)
export class TrayWindow {
    private window: BrowserWindow;

    private trayIcon: Tray;

    constructor() {
        this.window = createWindow({
            show: false,
            name: 'tray-page',
            remote: true,
            height: 500,
            width: 500,
            backgroundColor: '#E4ECEF',
            frame: false,
            fullscreenable: false,
            resizable: !isDev,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                enableRemoteModule: true,
                // add preload to load esm
                preload: path.resolve(path.join(__dirname, 'preload.js')),
                devTools: true,
            },
        });
        // Object BrowserWindow has a lot of standart events
        // We will hide Tray window on blur. To emulate standart behavior of the tray-like apps.
        this.window.on('blur', () => {
            this.window.hide();
        });

        this.trayIcon = new Tray(iconPath);
        this.trayIcon.setToolTip('Sample Desktop'); // This tooltip will show up, when user hovers over our tray-icon.

        // By clicking on the icon we have to show TrayWindow and position it in the middle under
        // the tray icon (initially this window is hidden).
        this.trayIcon.on('click', this.toggleWidow);
        // ipcMain.on(WB_HIDE_TRAY, this.ipcHideTray);
        // ipcMain.on(WB_SHOW_TRAY, this.ipcShowTray);
    }

    private toggleWidow = (e, bounds) => {
        this.window.isVisible() ? this.window.hide() : this.showWindow();
    };

    // Since we want the window to be shown under our icon, we need to get the position of the icon and then set the position of the window to be right under it. To achieve this, we create a getWindowPosition() method:
    private getWindowPosition = () => {
        const windowBounds = this.window.getBounds();
        const trayBounds = this.trayIcon.getBounds();

        // Center window horizontally below the tray icon
        const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
        // Position window 4 pixels vertically below the tray icon
        const y = Math.round(trayBounds.y + trayBounds.height + 4);
        return { x, y };
    };

    // This is a simple show / hide method. We’re using a one-line if statement; if the window is visible, hide it. If not, show it. The isVisible() method comes from Electron. Here is our showWindow() method:
    private showWindow = () => {
        const position = this.getWindowPosition();
        this.window.setPosition(position.x, position.y, false);
        this.window.show();
    };

    show() {
        this.window.show();
    }

    close() {
        this.window.close();
        this.window = null;
    }

    public updateTitle(title: string) {
        this.trayIcon.setTitle(title);
    }
}
