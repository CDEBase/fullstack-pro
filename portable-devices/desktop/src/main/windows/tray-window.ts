import * as path from 'path';
import { BrowserWindow, webContents } from 'electron';
import { format as formatUrl } from 'url';
import { config } from '../../config';
// import { Counter } from '../../../../../packages-modules/counter/browser/src/connected-react-router/components/Counter'

const TRAY_HTML_PAGE = 'tray-page.html'

export default class TrayWindow {

    public window: BrowserWindow;
    constructor() {


        // Creation of the new window.
        this.window = new BrowserWindow({
            show: false, // Initially, we should hide it, in such way will remove blink-effect.
            height: 500,
            width: 500,
            // width: 270,
            // This option will remove frame buttons. 
            // By default window has standart header buttons (close, hide, minimize). 
            // We should change this option because we want to display our window like
            // Tray Window not like common-like window.
            // frame: false,
            backgroundColor: '#E4ECEF',
            // resizable: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule:true,
             }
        });

        this.window.webContents.executeJavaScript(`window.localStorage.setItem( 'counter', '0' )`)
        
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
                pathname: TRAY_HTML_PAGE,
            });
            //  this.window.localStorage.setItem('user', 'hetal');
            // this.window.loadURL('http://localhost:3000/connected-react-router/counter')
            this.window.loadURL(htmlDevPath);
        } else {
            const htmlPath = formatUrl({
                pathname: path.join(__dirname, TRAY_HTML_PAGE),
                protocol: 'file',
                slashes: true,
            });
            this.window.loadURL(htmlPath);
        }

        // Object BrowserWindow has a lot of standart events
        // We will hide Tray window on blur. To emulate standart behavior of the tray-like apps.
        this.window.on('blur', () => {
            this.window.hide();
        });
    }
}