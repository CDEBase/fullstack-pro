import { interfaces } from 'inversify';
import { Feature } from '@common-stack/client-react';
import { ElectronTypes } from '@common-stack/client-core';

// const basicServiceGen = (container: interfaces.Container) => ({
//     mainWindow: container.get(ElectronTypes.MainWindow),
//     trayWindow: container.get(ElectronTypes.TrayWindow),
// });
const basicModule = new Feature({
    // createServiceFunc: [basicServiceGen],
});

export { basicModule };
