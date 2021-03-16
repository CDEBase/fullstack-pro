import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import { format as formatUrl } from 'url';



export default class TrayWindow {

    public window: BrowserWindow;
    constructor() {


        // Creation of the new window.
        this.window = new BrowserWindow({
            show: false, // Initially, we should hide it, in such way will remove blink-effect.
            height: 500,
            width: 270,
            // x: 120,
            // y: 200,
            // This option will remove frame buttons. 
            // By default window has standart header buttons (close, hide, minimize). 
            // We should change this option because we want to display our window like
            // Tray Window not like common-like window.
            frame: false,
            backgroundColor: '#E4ECEF',
            resizable: false,
            
        });

        const htmlPath = formatUrl({
            pathname: path.join(__dirname, 'tray-page.html'),
            protocol: 'file',
            slashes: false
          });
        this.window.loadURL(htmlPath);
        
        // Object BrowserWindow has a lot of standart events
        // We will hide Tray window on blur. To emulate standart behavior of the tray-like apps.
        this.window.on('blur', () => {
            this.window.hide();
        });
    }
}