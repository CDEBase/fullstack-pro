import { desktopCapturer, app } from 'electron';


const fs = require('fs');

export default class ScreenShot {
    public intervalId: any;

    constructor() {
        console.log("Screen Shot constructor called.");
    }

    public initScreenShot() {
        console.log("Screen Shot init called.");
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                console.log("Timer start");
                this.tackScreenShot();
            }, 60000);
        }

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
            console.log("screen info", sources);

            const entireScreenSource = sources.find(
                (source) => source.name === "Entire Screen" || source.name === "Screen 1"
            );

            const image = entireScreenSource.thumbnail.toPNG();
            let outputPath = null;
            switch (process.platform) {
                case 'win32':
                    outputPath = app.getPath('userData') + "\\screen-shot";
                    break;
                case 'darwin':
                case 'linux':
                    outputPath = app.getPath('userData') + "/screen-shot";
                    break;
                default:
                    break;
            }

            if (outputPath) {
                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath);
                }

                switch (process.platform) {
                    case 'win32':
                        outputPath = outputPath + "\\" + new Date().toString() + ".png";
                        break;
                    case 'darwin':
                    case 'linux':
                        outputPath = outputPath + "/" + new Date().toString() + ".png";
                        break;
                    default:
                        break;
                }

                fs.writeFile(outputPath, image, (err) => {
                    if (err) {
                        return console.error("ERROR into writing file =====", err);
                    } else {
                        console.log("File write in folder");
                    }
                });
            }
        } catch (e) {
            console.log("error tack screen shot", e);
        }

    }

    public destoryScreenShot() {
        console.log("Screen Shot destory called.", this.intervalId);
        clearInterval(this.intervalId);
    }
}