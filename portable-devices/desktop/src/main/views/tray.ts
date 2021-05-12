/* eslint-disable no-use-before-define */
import { provide } from 'inversify-binding-decorators';
import { BrowserWindow, ipcMain, Tray } from 'electron';
import * as path from 'path';
import Positioner from 'electron-positioner';
import { createWindow } from '../utils';
import { IPC_EVENTS } from '../../common';

const iconPath = path.join(__dirname, '../../assets/icons/16x16.png');

@provide(TrayWindow)
export class TrayWindow {
    private window: BrowserWindow;

    private trayIcon: Tray;

    constructor() {
        this.window = createWindow({ name: 'tray-page', remote: true, height: 300, width: 200 });
        // Object BrowserWindow has a lot of standart events
        // We will hide Tray window on blur. To emulate standart behavior of the tray-like apps.
        this.window.on('blur', () => {
            this.window.hide();
        });

        this.trayIcon = new Tray(iconPath);
        this.trayIcon.setToolTip('Sample Desktop'); // This tooltip will show up, when user hovers over our tray-icon.

        // By clicking on the icon we have to show TrayWindow and position it in the middle under
        // the tray icon (initially this windo is hidden).
        this.trayIcon.on('click', (e, bounds) => {
            if (this.window.isVisible()) {
                this.window.hide();
            } else {
                const positioner = new Positioner(this.window);
                positioner.move('trayCenter', bounds);

                this.window.show();
            }
        });
        // ipcMain.on(WB_HIDE_TRAY, this.ipcHideTray);
        // ipcMain.on(WB_SHOW_TRAY, this.ipcShowTray);
    }

    show() {
        this.window.show();
    }

    close() {
        this.window.close();
        this.window = null;
    }

    public updateTitle(title: string) {
        const time = `00:0${title}`;
        console.log('----tititle----', time);
        this.trayIcon.setTitle(title);
    }
}
