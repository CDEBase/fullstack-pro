import { ContainerModule, interfaces } from 'inversify';
import { Feature } from '@common-stack/client-react';
import { BrowserWindow } from 'electron';


const basicServiceGen = (container: interfaces.Container) => ({
    trayIcon: container.get(TYPES.ITrayIcon),
});
const basicContainer: (settings) => interfaces.ContainerModule = (settings) =>
    new ContainerModule((bind: interfaces.Bind) => {
        bind()
    });

const basicModule = new Feature({
    createContainerFunc: [basicContainer],
    createServiceFunc: [basicServiceGen],
});

export { basicModule };
