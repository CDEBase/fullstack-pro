import * as path from 'path';
import { app, BrowserWindow, Tray } from 'electron';
import Positioner from 'electron-positioner';

const iconPath = path.join(__dirname, '../../assets/icons/16x16.png');

export default class TrayIcon {

    public trayIcon: Tray;
    constructor(trayWindow: BrowserWindow) {
        // Path to the app icon that will be displayed in the Tray (icon size: 22px)

        this.trayIcon = new Tray(iconPath);
        this.trayIcon.setToolTip('Sample Desktop'); // This tooltip will show up, when user hovers over our tray-icon.

        // By clicking on the icon we have to show TrayWindow and position it in the middle under
        // the tray icon (initially this windo is hidden).
        this.trayIcon.on('click', (e, bounds) => {
            if (trayWindow.isVisible()) {
                trayWindow.hide();
            } else {
                let positioner = new Positioner(trayWindow);
                positioner.move('trayCenter', bounds);

                trayWindow.show();
            }
        })
    }

    public updateTitle(title: string) {
        console.log('----tititle----', title);
        this.trayIcon.setTitle(title);
    }
}