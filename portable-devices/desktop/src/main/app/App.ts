/* eslint-disable no-use-before-define */
import { inject } from 'inversify';
import { app, ipcMain, Menu } from 'electron';
import { windows } from 'electron-is';
import { logger, provideSingleton } from '../utils';
import { template } from '../menu-template';
import { Service } from './Service';
import { View } from './View';

@provideSingleton(App)
export class App {
    constructor() {
        app.whenReady().then(() => {
            this.services.init();

            this.views.init();

            logger.info('The app is initialized!');
        });

        app.on('window-all-closed', () => {
            if (windows()) {
                app.quit();
            }
        });
        app.on('activate', this.onActivate);

        app.on('before-quit', () => {
            this.beforeQuit();
            app.exit();
        });

        ipcMain.on('show-main-window-event', () => {
            app.dock.show();
        });

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }

    @inject(View)
    views!: View;

    @inject(Service)
    services!: Service;

    onActivate = () => {
        this.views.main.show();
        app.dock.show();
    };

    beforeQuit() {
        this.views.close();
    }
}
