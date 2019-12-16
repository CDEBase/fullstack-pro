const glob = require('glob');
const fs = require('fs');
const folder = '../servers/**/';

glob(`${folder}package.json`, null, (err, files) => {
    if (err) return console.error('Unable to scan directory: ' + err);

    files.forEach(file => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) return console.error('Unable to scan directory: ' + err);

            const obj = JSON.parse(data);
            const { dependencies } = obj;
            const fileWrie = file

            for (let key in dependencies) {

                if (dependencies[key].includes('file')){
                    const folderRoad = dependencies[key].split(':');
                    const localFolder = folderRoad[1].slice(3);

                    glob(`${localFolder}/package.json`, null, (err, files) => {
                        if (err) return console.error('Unable to scan directory: ' + err);

                        files.forEach(file => {
                            fs.readFile(file, 'utf-8', (err, data) => {
                                if (err) return console.error('Unable to scan directory: ' + err);

                                const objVersion = JSON.parse(data);
                                const { version } = objVersion;
                                dependencies[key] = version;
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

