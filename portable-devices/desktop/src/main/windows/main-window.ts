import * as path from 'path';
import { BrowserWindow, shell } from 'electron';
import { format as formatUrl } from 'url';
import { config } from '../../config';


const MAIN_HTML_PAGE = 'main-page.html'
export default class MainWindow {
    public window: BrowserWindow;

    constructor() {

        this.window = new BrowserWindow({
            show: false,
            width: 400,
            height: 400,
            frame: false,
            minWidth: 800,
            minHeight: 600,
            backgroundColor: '#E4ECEF',
            webPreferences: { nodeIntegration: true, webSecurity: false }
        });

        if (config.isDevelopment) {
            this.window.webContents.openDevTools()

            this.window.webContents.on('devtools-opened', () => {
                this.window.focus()
                setImmediate(() => {
                    this.window.focus()
                });
            });
            const htmlDevPath = formatUrl({
                protocol: "http",
                slashes: true,
                hostname: config.ELECTRON_WEBPACK_WDS_HOST,
                port: config.ELECTRON_WEBPACK_WDS_PORT,
                pathname: MAIN_HTML_PAGE,
            });
            this.window.loadURL(htmlDevPath);
        } else {
            const htmlPath = formatUrl({
                pathname: path.join(__dirname, MAIN_HTML_PAGE),
                protocol: 'file',
                slashes: true,
            });
            this.window.loadURL(htmlPath);
        }

        this.window.on('closed', () => {
            this.window = null
        });

        // Open urls in the user's browser
        this.window.webContents.on('new-window', (event, url) => {
            event.preventDefault();
            shell.openExternal(url);
        });

        // @TODO: Use 'ready-to-show' event
        //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
        this.window.webContents.on('did-finish-load', () => {
            if (!this.window) {
                throw new Error('"mainWindow" is not defined');
            }
            if (process.env.START_MINIMIZED) {
                this.window.minimize();
            } else {
                this.window.show();
                this.window.focus();
            }
        });



    }
}