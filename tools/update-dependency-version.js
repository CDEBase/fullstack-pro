const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');
const glob = require('glob');

const git = simpleGit();
const monorepoRoot = path.resolve(__dirname, '..');

// matching prettier format
const JSON_SPACING = 4;
const ADD_END_NEWLINE = true; // Set to true to add a newline at the end of the file

const findPackageJsonFiles = () => {
    return new Promise((resolve, reject) => {
        glob(
            `${monorepoRoot}/+(servers|portable-devices|packages|packages-modules)/**/package.json`,
            { onlyFiles: true, ignore: '**/node_modules/**' },
            (err, files) => {
                if (err) reject(`Unable to scan directory: ${err}`);
                resolve(files);
            },
        );
    });
};

const buildPackageMap = async () => {
    const packageJsonFiles = await findPackageJsonFiles();
    const packageMap = new Map();

    packageJsonFiles.forEach((file) => {
        const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (packageJson.name) {
            packageMap.set(packageJson.name, {
                path: path.dirname(file),
                version: packageJson.version,
            });
        }
    });

    return packageMap;
};

const searchAndUpdate = (dependencies, filePath, obj, packageMap) => {
    let modified = false;

    for (const key in dependencies) {
        if (dependencies[key].startsWith('link:')) {
            const relativeDepFolder = dependencies[key].split('link:')[1];
            const dependencyFolder = path.join(path.dirname(filePath), relativeDepFolder);

            try {
                const packageJsonPath = path.join(dependencyFolder, 'package.json');
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                if (dependencies[key] !== packageJson.version) {
                    dependencies[key] = packageJson.version;
                    modified = true;
                }
            } catch (err) {
                console.error(`Error updating ${key} in ${filePath}: ${err.message}`);
                throw err;
            }
        } else if (packageMap.has(key)) {
            const version = packageMap.get(key).version;
            if (dependencies[key] !== version) {
                dependencies[key] = version;
                modified = true;
            }
        }
    }

    if (modified) {
        // Write the updated package.json back to disk with or without a newline at the end
        let formattedJson = JSON.stringify(obj, null, JSON_SPACING);
        if (ADD_END_NEWLINE) {
            formattedJson += '\n';
        }
        fs.writeFileSync(filePath, formattedJson, 'utf8');
    }

    return modified;
};

const updateDependencies = async () => {
    const packageMap = await buildPackageMap();
    const packageJsonFiles = await findPackageJsonFiles();
    const modifiedFiles = [];

    packageJsonFiles.forEach((file) => {
        if (!file.includes('node_modules')) {
            try {
                const data = fs.readFileSync(file, 'utf8');
                const obj = JSON.parse(data);
                const { dependencies, peerDependencies, devDependencies } = obj;

                let modified = false;
                modified = searchAndUpdate(dependencies, file, obj, packageMap) || modified;
                modified = searchAndUpdate(peerDependencies, file, obj, packageMap) || modified;
                modified = searchAndUpdate(devDependencies, file, obj, packageMap) || modified;

                if (modified) {
                    modifiedFiles.push(file);
                }
            } catch (err) {
                console.error(`Unable to read file ${file}: ${err.message}`);
            }
        }
    });

    if (modifiedFiles.length > 0) {
        await git.add(modifiedFiles);
        await git.commit('Updated packages to use correct versions and linked dependencies');
    } else {
        console.log('No changes detected');
    }
};

updateDependencies()
    .then(() => {
        console.log('Dependencies updated successfully.');
    })
    .catch((err) => console.error(`Error in updateDependencies: ${err.message}`));
