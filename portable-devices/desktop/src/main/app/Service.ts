/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
import { inject } from 'inversify';
import { ipcMain } from 'electron';
import { logAfter, logBefore, provideSingleton } from '../utils';
import { CHANNELS } from '../../common';
import { SystemService, UserService } from '../services';

@provideSingleton(Service)
export class Service {
    /** Service class * */

    @inject(UserService)
    user!: UserService;

    @inject(SystemService)
    system!: SystemService;

    /**
     * Handle the initialization of all services
     */
    @logBefore('[Service] Initialize service...')
    @logAfter('[Service] Initialization complete!')
    init() {
        // Service on the bridge
        // global.services = {
        //     user: this.user,
        //     system: this.system,
        // };

        // Check macOS permissions on the bridge
        ipcMain.handle(CHANNELS.CHECK_ACCESSIBILITY_FOR_MAC_OS, this.system.checkAccessibilityForMacOS);
    }
}
