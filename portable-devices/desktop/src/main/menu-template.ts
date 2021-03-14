
import { app, shell, ipcMain, MenuItem } from 'electron';
import MainWindow from './windows/main-window';


export const menuTemplate = function (mainWindow: MainWindow): any[] {
    return [
        {
            label: 'Electron',
            submenu: [{
                label: 'About Timesheets',
                selector: 'orderFrontStandardAboutPanel:',
            }, {
                type: 'separator',
            }, {
                label: 'Services',
                submenu: [],
            }, {
                type: 'separator',
            }, {
                label: 'Hide ElectronReact',
                accelerator: 'Command+H',
                selector: 'hide:',
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:',
            }, {
                label: 'Show All',
                selector: 'unhideAllApplications:',
            }, {
                type: 'separator',
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() {
                    app.quit();
                },
            }],
        },
        {
            label: 'Edit',
            submenu: [{
                label: 'Undo',
                accelerator: 'Command+Z',
                selector: 'undo:',
            }, {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:',
            }, {
                type: 'separator',
            }, {
                label: 'Cut',
                accelerator: 'Command+X',
                selector: 'cut:',
            }, {
                label: 'Copy',
                accelerator: 'Command+C',
                selector: 'copy:',
            }, {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:',
            }, {
                label: 'Select All',
                accelerator: 'Command+A',
                selector: 'selectAll:',
            }],
        },
        // {
        //     label: 'View',
        //     submenu: (process.env.NODE_ENV === 'development') ? [{
        //         label: 'Reload',
        //         accelerator: 'Command+R',
        //         click() {
        //             browserWindow.webContents.reload();
        //         },
        //     }, {
        //         label: 'Toggle Full Screen',
        //         accelerator: 'Ctrl+Command+F',
        //         click() {
        //             browserWindow.setFullScreen(!browserWindow.isFullScreen());
        //         },
        //     }, {
        //         label: 'Toggle Developer Tools',
        //         accelerator: 'Alt+Command+I',
        //         click() {
        //             browserWindow.toggleDevTools();
        //         },
        //     }] : [{
        //         label: 'Toggle Full Screen',
        //         accelerator: 'Ctrl+Command+F',
        //         click() {
        //             browserWindow.setFullScreen(!browserWindow.isFullScreen());
        //         },
        //     }],
        // },
        {
            label: 'Window',
            submenu: [{
                label: 'Minimize',
                accelerator: 'Command+M',
                selector: 'performMiniaturize:',
            }, {
                label: 'Close',
                accelerator: 'Command+W',
                selector: 'performClose:',
            }, {
                type: 'separator',
            }, {
                label: 'Bring All to Front',
                selector: 'arrangeInFront:',
            }],
        },
    ]
}