const glob = require('glob');
const fs = require('fs');
const SERVER_FOLDER = './servers';
const simpleGit = require('simple-git/promise');
const git = simpleGit();

glob(`./+(servers|packages|packages-modules)/**/package.json`, null, (err, files) => {
    if (err) return console.error('Unable to scan directory: ' + err);

    files.forEach(file => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) return console.error('Unable to scan directory: ' + err);

            const obj = JSON.parse(data);
            const { dependencies } = obj;
            const fileWrie = file

            for (let key in dependencies) {
                if (dependencies[key].includes('file:')){
                    const folderRoad = dependencies[key].split('file:');
                    let localFolder = folderRoad[1].replace(/(\.\.\/)/g,'');
                    try {
                        fs.readdirSync(localFolder)
                    } catch (err) {
                        console.log('--- err', err.message);
                        // then find relative dir
                        const subDirPath = file.split('/');
                        localFolder = `${subDirPath[1]}/${localFolder}`
                    }
                    
                    console.log('--Folder', localFolder)
                    glob(`${localFolder}/package.json`, null, (err, files) => {
                        if (err) return console.error('Unable to scan directory: ' + err);
                        console.log(files)
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
    git.add('.')
    .then(() => {
        git.status()
        .then((status) => {
            if (status.modified.length){
                const fileArray = status.modified.filter(element =>  element.includes('package.json'));
                const addArray = fileArray.map(element => `./${element}`)
                git.add(addArray);
                git.commit('corrected packages version!');
            } else console.log('no change');
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
})
