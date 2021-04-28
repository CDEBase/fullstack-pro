import { BrowserWindow } from 'electron';

export interface ITrayWindow {
    window: BrowserWindow;
    init(): void;
}
