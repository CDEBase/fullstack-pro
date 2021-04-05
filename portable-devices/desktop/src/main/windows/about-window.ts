import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import { format as formatUrl } from 'url';
import Positioner from 'electron-positioner';

export default class AboutWindow {

    public window: BrowserWindow;

    constructor() {

        this.window = new BrowserWindow({
            show: false,
            width: 300,
            height: 336,
            frame: false,
            backgroundColor: '#E4ECEF',
        });

        const htmlPath = formatUrl({
            pathname: path.join(__dirname, 'about-page.html'),
            protocol: 'file',
            slashes: false
        });

        this.window.loadURL(htmlPath);

        // About Window will disappear in blur.
        this.window.on('blur', () => {
            this.window.hide();
        });

        // On show - we should display About Window in the center of the screen.
        this.window.on('show', () => {
            let positioner = new Positioner(this.window);
            positioner.move('center');
        });
    }
}