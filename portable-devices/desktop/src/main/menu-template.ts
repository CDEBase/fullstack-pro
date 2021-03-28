import { format as formatUrl } from 'url';
import { app, shell, ipcMain, MenuItem, Menu, BrowserWindow } from 'electron';
import MainWindow from './windows/main-window';
import AboutWindow from './windows/about-window';

export const template: Electron.MenuItemConstructorOptions[] = [{
        label: 'Edit',
        submenu: [
            { role: 'undo'},
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll'}
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    { role: 'window', submenu: [{ role: 'minimize' }, { role: 'close' }] },
    {
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click() {
                require('electron').shell.openExternal('https://electron.atom.io');
            }
        },{
            label: 'about',
            click(){
                console.log("================Clicked About====================")
                const about = new AboutWindow();
                about.window.show();
            }
        }]
    }
];

