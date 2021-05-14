import { Tray } from 'electron';

export interface ITraceIcon {
    trayIcon: Tray;
    updateTitle(title: string): void;
}
