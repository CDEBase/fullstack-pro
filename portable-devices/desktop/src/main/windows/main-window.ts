import * as path from 'path';
import { BrowserWindow } from 'electron';
import { format as formatUrl } from 'url';

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
        });

        const htmlPath = formatUrl({
            pathname: path.join(__dirname, 'main-page.html'),
            protocol: 'file',
            slashes: false
        });


        this.window.loadURL(htmlPath);
    }
}