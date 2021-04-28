import { ContainerModule, interfaces } from 'inversify';
import { Feature } from '@common-stack/client-react';
import { BrowserWindow } from 'electron';
import { ITraceIcon, ITrayWindow, TYPES } from './interfaces';
import TrayIcon from './tray-icon';
import TrayWindow from './windows/tray-window';

const basicServiceGen = (container: interfaces.Container) => ({
    trayIcon: container.get(TYPES.ITrayIcon),
});
const basicContainer: (settings) => interfaces.ContainerModule = (settings) =>
    new ContainerModule((bind: interfaces.Bind) => {
        bind<ITraceIcon>(TYPES.ITrayIcon).to(TrayIcon).inSingletonScope();
        bind<ITrayWindow>(TYPES.ITrayWindow).to(TrayWindow).inSingletonScope();
    });

const basicModule = new Feature({
    createContainerFunc: [basicContainer],
    createServiceFunc: [basicServiceGen],
});

export { basicModule };
