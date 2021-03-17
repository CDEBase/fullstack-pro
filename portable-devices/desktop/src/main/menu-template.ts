import { format as formatUrl } from 'url';
import { app, shell, ipcMain, MenuItem, Menu, BrowserWindow } from 'electron';
import MainWindow from './windows/main-window';
import AboutWindow from './windows/about-window';
import path from 'path';

const createModal = (parentWindow, width, height) => {
    let modal = new BrowserWindow({
      width: width,
      height: height,
      modal: true,
      parent: parentWindow,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    const htmlPath = formatUrl({
        pathname: path.join(__dirname, 'about-page.html'),
        protocol: 'file',
        slashes: false
    });

    modal.loadFile(htmlPath)
  
    return modal;
  
  }




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
            click(menuItem, browserWindow, event){
                console.log("================Clicked About====================")
                // ipcRenderer.send('about-window');
                // browserWindow.webContents.send('show-about-window-event');
                // console.log("================After Clicked About====================")
                // require('electron').shell.openExternal('http://localhost:3000/');
                createModal(MainWindow,600,800);
            }
        }]
    }
];

