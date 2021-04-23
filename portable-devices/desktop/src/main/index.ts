import { app, ipcMain, Menu, webContents } from 'electron';
import TrayWindow from './windows/tray-window';
import MainWindow from './windows/main-window';
import AboutWindow from './windows/about-window';
import TrayIcon from './tray-icon';
import { template } from './menu-template';
import ScreenShot from './screen-shot';
import { createReduxStore } from '../renderer/config/redux-config';

// import { connectedReactRouter_counter } from '../reducers';

const isDev = process.env.NODE_ENV === 'development';

let installExtension = null;
if (isDev) {
    installExtension = require('electron-devtools-installer');
}

// const { forwardToRenderer, triggerAlias, replayActionMain, createAliasedAction } = require('electron-redux');

// const { createStore, applyMiddleware } = require('redux');

// const store = createStore(connectedReactRouter_counter, 0, applyMiddleware(triggerAlias, forwardToRenderer));
// replayActionMain(store);
// createAliasedAction('INCREMENT_ALIASED', () => ({ type: 'INCREMENT' }));

let tray: TrayWindow = null;
let main: MainWindow = null;
let screenShot: ScreenShot = null;
let about: AboutWindow = null;

let trayIcon: TrayIcon = null;

// We hide dock, because we do not want to show our app as common app.
// We want to display our app as a Tray-lik app (like Dropbox, Skitch or ets).
// app.dock.hide();

// This event will be emitted when Electron has finished initialization.
app.on('ready', function () {
    if (isDev) {
        installExtentions();
    }

    tray = new TrayWindow();
    main = new MainWindow();
    about = new AboutWindow();
    screenShot = new ScreenShot();

    trayIcon = new TrayIcon(tray.window);

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

// Custom event created to close the app from Tray Window.
// The ipcMain module is used to handle events from a renderer process (web page).
ipcMain.on('quit-app', function () {
    console.log('--QUIT_APP');
    main.window.close();
    tray.window.close(); // Standart Event of the BrowserWindow object.
    about.window.close();
    app.quit();
    screenShot.destoryScreenShot(); // Standart event of the app - that will close our app.
});

// Custom events MAIN WINDOW
ipcMain.on('show-main-window-event', function () {
    if (main && main.window) {
        main.window.show();
    }
    app.dock.show();
    screenShot.initScreenShot();
});

ipcMain.on('about-window', function () {
    console.log('###################');
    about.window.show();
});

// Custom events ABOUT WINDOW
ipcMain.on('show-about-window-event', function () {
    about.window.show();
});

// Custom events TRAY WINDOW
ipcMain.on('update-title-tray-window-event', function (event, title) {
    console.log('main window');
    if (main && main.window) {
        main.window.show();
    }
    trayIcon.updateTitle(title);
    screenShot.initScreenShot();
});

const installExtentions = function () {
    installExtension.default(installExtension.REDUX_DEVTOOLS);
    installExtension.default(installExtension.REACT_DEVELOPER_TOOLS);
};
