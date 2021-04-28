import * as path from 'path';
import { BrowserWindow, Tray } from 'electron';
import Positioner from 'electron-positioner';
import { injectable, inject } from 'inversify';
import { TYPES, ITraceIcon, ITrayWindow } from './interfaces';

const iconPath = path.join(__dirname, '../../assets/icons/16x16.png');

@injectable()
export default class TrayIcon implements ITraceIcon {
    public trayIcon: Tray;

    constructor(
        @inject(TYPES.ITrayWindow)
        trayWindow: ITrayWindow,
    ) {
        // Path to the app icon that will be displayed in the Tray (icon size: 22px)

        this.trayIcon = new Tray(iconPath);
        this.trayIcon.setToolTip('Sample Desktop'); // This tooltip will show up, when user hovers over our tray-icon.

        // By clicking on the icon we have to show TrayWindow and position it in the middle under
        // the tray icon (initially this windo is hidden).
        this.trayIcon.on('click', (e, bounds) => {
            if (trayWindow.window.isVisible()) {
                trayWindow.window.hide();
            } else {
                const positioner = new Positioner(trayWindow.window);
                positioner.move('trayCenter', bounds);

                trayWindow.window.show();
            }
        });
    }

    public updateTitle(title: string): void {
        const time = `00:0${title}`;
        console.log('----tititle----', time);
        this.trayIcon.setTitle(title);
    }
}
