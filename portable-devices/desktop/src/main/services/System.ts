/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
import { systemPreferences } from 'electron';
import { provideSingleton } from '../utils';
import { isMacOS } from '../../common';

@provideSingleton(SystemService)
export class SystemService {
    /**
     * Check availability
     */
    checkAccessibilityForMacOS() {
        if (!isMacOS) return;
        return systemPreferences.isTrustedAccessibilityClient(true);
    }
}
