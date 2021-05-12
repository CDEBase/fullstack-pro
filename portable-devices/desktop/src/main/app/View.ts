/* eslint-disable no-use-before-define */
import { inject } from 'inversify';
import { HomeWindow, TrayWindow, AboutWindow } from '../views';
import { logAfter, logBefore, provideSingleton } from '../utils';

@provideSingleton(View)
export class View {
    @inject(HomeWindow)
    home!: HomeWindow;

    @inject(AboutWindow)
    about!: AboutWindow;

    @inject(TrayWindow)
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
        this.home.close();
        this.about.close();
        this.tray.close();
    }
}
