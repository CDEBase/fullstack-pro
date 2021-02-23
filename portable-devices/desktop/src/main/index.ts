
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 */
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { config } from '../config';
import { format as formatUrl } from 'url';


const isDevelopment = config.isDevelopment;

// Global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;

const createMainWindow = () => {
  // Create the browser window.
  const window = new BrowserWindow({webPreferences: {nodeIntegration: true,  webSecurity: false}});
  if (isDevelopment) {
    window.webContents.openDevTools()
  }

console.log('---ISDEVEO', config.isDev, config.isDevelopment);
  if (isDevelopment) {
    // window.loadURL(`http://localhost:${config.ELECTRON_WEBPACK_WDS_PORT}`);
    window.loadURL(formatUrl({
      protocol: "http",
      slashes: true,
      hostname: config.ELECTRON_WEBPACK_WDS_HOST,
      port: config.ELECTRON_WEBPACK_WDS_PORT,
    }));

  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))

  }

  window.on('closed', () => {
    mainWindow = null
  });

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    });
  });

  return window;
};

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it is common to re-create a window even after all windows have been closed
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
});
