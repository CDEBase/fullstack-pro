import { desktopCapturer, app, BrowserWindow } from 'electron';

const AWS = require('aws-sdk');
const fs = require('fs');
const checkInternetConnected = require('check-internet-connected');

export default class ScreenShot {
    public intervalId: any;
    public s3: any;
    public outputPath: String;

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: '',
            secretAccessKey: '',
            Bucket: 'cdmbase-screenshot-dev',
            signatureVersion: "v4",
        });
        this.getFolderPath();
    }

    public initScreenShot() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.tackScreenShot();
            }, 30000);
        }
        // window.webContents.executeJavaScript(`window.localStorage.setItem( '${key}', '${value}' )`)
    }

    public async tackScreenShot() {
        try {
            const sources = await desktopCapturer.getSources({
                types: ["screen"],
                thumbnailSize: {
                    width: 1000,
                    height: 1000,
                },
            });

            const entireScreenSource = sources.find(
                (source) => source.name === "Entire Screen" || source.name === "Screen 1"
            );

            const image = entireScreenSource.thumbnail.toPNG();

            checkInternetConnected()
                .then((result) => {
                    fs.readdir(this.outputPath, (err, files) => {
                        files.forEach(file => {
                            let filePath;
                            switch (process.platform) {
                                case 'win32':
                                    filePath = this.outputPath + "\\" + file;
                                    break;
                                case 'darwin':
                                case 'linux':
                                    filePath = this.outputPath + "/" + file;
                                    break;
                                default:
                                    break;
                            }
                            fs.readFile(filePath, (err, data) => {
                                if (data) {
                                    this.uploadImageToS3(image);
                                    fs.unlink(filePath, (err) => {
                                        if (err) throw err;
                                    });
                                }
                            })
                        });
                    });
                    this.uploadImageToS3(image);
                })
                .catch((error) => {
                    this.storeFileInLocalMachine(image);
                });
        } catch (e) {
            console.log("error tack screen shot", e);
        }
    }

    public getFolderPath() {
        switch (process.platform) {
            case 'win32':
                this.outputPath = app.getPath('userData') + "\\screen-shot";
                break;
            case 'darwin':
            case 'linux':
                this.outputPath = app.getPath('userData') + "/screen-shot";
                break;
            default:
                break;
        }
    }

    public storeFileInLocalMachine(image: any) {
        if (this.outputPath) {
            let filePath;
            if (!fs.existsSync(this.outputPath)) {
                fs.mkdirSync(this.outputPath);
            }

            switch (process.platform) {
                case 'win32':
                    filePath = this.outputPath + "\\" + new Date().getTime() + ".png";
                    break;
                case 'darwin':
                case 'linux':
                    filePath = this.outputPath + "/" + new Date().getTime() + ".png";
                    break;
                default:
                    break;
            }

            fs.writeFile(filePath, image, (err) => {
                if (err) {
                    console.log("Error in file write", err);
                }
            });
        }
    }

    public uploadImageToS3(image: any) {
        this.s3.upload({
            Bucket: 'cdmbase-screenshot-dev',
            Key: `${new Date().getTime()}.png`,
            signatureVersion: "v4",
            Body: image,
        }, (err, data) => {
            if (err) {
                this.storeFileInLocalMachine(image);
            } 
        });
    }

    public destoryScreenShot() {
        clearInterval(this.intervalId);
    }
}