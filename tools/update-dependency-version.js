const glob = require('glob');
const fs = require('fs');
const SERVER_FOLDER = './servers';

glob(`${SERVER_FOLDER}/**/package.json`, null, (err, files) => {

    if (err) return console.error('Unable to scan directory: ' + err);

    files.forEach(file => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) return console.error('Unable to scan directory: ' + err);

            const obj = JSON.parse(data);
            const { dependencies } = obj;
            const fileWrie = file

            for (let key in dependencies) {
                if (dependencies[key].includes('file:')){
                    const folderRoad = dependencies[key].split(':');
                    const localFolder = folderRoad[1].slice(3);
                    glob(`${SERVER_FOLDER}/${localFolder}/package.json`, null, (err, files) => {
                        if (err) return console.error('Unable to scan directory: ' + err);

                        files.forEach(file => {
                            fs.readFile(file, 'utf-8', (err, data) => {
                                if (err) return console.error('Unable to scan directory: ' + err);

                                const objVersion = JSON.parse(data);
                                const { version } = objVersion;
                                dependencies[key] = `^${version}`;
                                const str = JSON.stringify(obj, null, 2);
                                fs.writeFileSync(fileWrie, str,  'ascii');
                            });
                        });
                    });
                }
            }
        });
    });
})

