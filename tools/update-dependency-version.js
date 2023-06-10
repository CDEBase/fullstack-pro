/* eslint-disable jest/require-hook */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable consistent-return */
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const SERVER_FOLDER = './servers';
const simpleGit = require('simple-git');

const git = simpleGit();

const searchAndUpdate = (dependencies, filePath, obj) => {
    const fileWrie = filePath;
    const packageDir = path.dirname(filePath);
    console.log('---PACKAGE DIR', packageDir);
    for (const key in dependencies) {
        if (dependencies[key].includes('link:')) {
            const relativeDepFolder = dependencies[key].split('link:')[1];
            console.log('--FOLDER ROAD', relativeDepFolder);
            const dependencyFolder = path.join(packageDir, relativeDepFolder);
            try {
                fs.readdirSync(dependencyFolder);
            } catch (err) {

                console.log(`--- err ${err.message}`);
                console.log(
                    `err Search for dependency of ${filePath} with package path ${relativeDepFolder} not found`,
                );
                throw err;
            }
            glob(`${dependencyFolder}/package.json`, { ignore: '**/node_modules/**' }, (err, files) => {
                if (err) return console.error(`Unable to scan directory: ${err}`);
                console.log(files);
                files.forEach((file) => {
                    fs.readFile(file, 'utf-8', (err, data) => {
                        if (err) return console.error(`Unable to scan directory: ${err}`);
                        try {
                            const objVersion = JSON.parse(data);
                            const { version } = objVersion;
                            dependencies[key] = `${version}`;
                            const str = JSON.stringify(obj, null, 2);
                            fs.writeFileSync(fileWrie, str, 'ascii');
                        } catch (err) {
                            console.error(`Failed at file: ${file}`)
                            throw (err);
                        }

                    });
                });
            });
        }
    }
};

glob(
    './+(servers|portable-devices|packages|packages-modules)/**/package.json',
    { onlyFiles: false, ignore: '**/node_modules/**' },
    (err, files) => {
        if (err) return console.error(`Unable to scan directory: ${err}`);
        files.forEach((file) => {
            if (!file.includes('node_modules')) {
                fs.readFile(file, 'utf-8', (err, data) => {
                    if (err) return console.error(`Unable to scan directory: ${err}`);
                    try {
                        const obj = JSON.parse(data);
                        const { dependencies, peerDependencies, devDependencies } = obj;
                        searchAndUpdate(dependencies, file, obj);
                        searchAndUpdate(peerDependencies, file, obj);
                        searchAndUpdate(devDependencies, file, obj);
                    } catch (err) {
                        console.error(`Errored at ${file}`);
                        console.error(err);
                    }
                });
            }
        });
        git.add('.')
            .then(() => {
                git.status()
                    .then((status) => {
                        console.log('POST GIT CHANGES', status);
                        if (status.modified.length) {
                            const fileArray = status.modified.filter((element) => element.includes('package.json'));
                            const addArray = fileArray.map((element) => `./${element}`);
                            git.add(addArray);
                            git.commit('corrected packages version!');
                        } else console.log('no change');
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => console.error(err));
    },
);