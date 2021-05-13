/* eslint-disable no-use-before-define */
import { inject } from 'inversify';
import { ElectronTypes } from '@common-stack/client-core';
import { MainWindow, TrayWindow, AboutWindow } from '../views';
import { logAfter, logBefore, provideSingleton } from '../utils';

@provideSingleton(View)
export class View {
    @inject(ElectronTypes.MainWindow)
    main!: MainWindow;

    @inject(ElectronTypes.AboutWindow)
    about!: AboutWindow;

    @inject(ElectronTypes.TrayWindow)
    tray!: TrayWindow;

    /**
     * Process all window initialization
     */
    @logBefore('[View] Initialization...')
    @logAfter('[View] Initialization complete!')
    init() {
        // Window on the bridge
        // global.windows = {
        //     home: this.home,
        //     tray: this.tray,
        //     about: this.about,
        // };
    }

    close() {
        this.main.close();
        this.about.close();
        this.tray.close();
    }
}
