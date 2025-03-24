import glob from 'glob';
import { resolve, dirname, relative } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import simpleGit from 'simple-git';
import { runLintStaged } from './runLint.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// matching prettier format
const JSON_SPACING = 4;
const ADD_END_NEWLINE = true; // Set to true to add a newline at the end of the file

const git = simpleGit();

const monorepoRoot = resolve(__dirname, '..');

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
        const packageJson = JSON.parse(readFileSync(file, 'utf8'));
        if (packageJson.name) {
            packageMap.set(packageJson.name, {
                path: dirname(file),
                version: packageJson.version,
            });
        }
    });

    return packageMap;
};

const searchAndUpdate = (dependencies, filePath, obj, packageMap) => {
    let modified = false;

    for (const key in dependencies) {
        if (packageMap.has(key)) {
            const targetDir = packageMap.get(key).path;
            const relativePath = `link:${relative(dirname(filePath), targetDir)}`;

            if (dependencies[key] !== relativePath) {
                dependencies[key] = relativePath;
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
        writeFileSync(filePath, formattedJson, 'utf8');
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
                const data = readFileSync(file, 'utf8');
                const obj = JSON.parse(data);
                const { dependencies, peerDependencies, devDependencies } = obj;

                let modified = false;
                modified = searchAndUpdate(dependencies, file, obj, packageMap) || modified;
                modified = searchAndUpdate(peerDependencies, file, obj, packageMap) || modified;
                modified = searchAndUpdate(devDependencies, file, obj, packageMap) || modified;

                if (modified) {
                    console.log('--PUSHING FILE=---', file);
                    modifiedFiles.push(file);
                }
            } catch (err) {
                console.error(`Unable to read file ${file}: ${err.message}`);
            }
        }
    });

    return modifiedFiles;
};

updateDependencies()
    .then((modifiedFiles) => {
        const addArray = modifiedFiles.map((file) => `./${relative(monorepoRoot, file)}`);
        console.log('-- Modified Files --', modifiedFiles, addArray);
        if (addArray.length === 0) {
            console.log('No files to stage.');
            return null;
        }
        return git.add(addArray).then(() => git.status()); // Stage files and then check status
    })
    .then((status) => {
        if (status && status.modified.length) {
            const fileArray = status.modified.filter((element) => element.includes('package.json'));
            const addArray = fileArray.map((element) => `./${element}`);
            return git
                .add(addArray)
                .then(runLintStaged)
                .then(() => git.status()); // Run lint-staged after adding
        } else {
            console.log('No changes to lint or commit.');
            return null;
        }
    })
    .then((status) => {
        if (status && status.modified.length > 0) {
            return git.commit('Updated packages to use correct versions and linked dependencies');
        } else {
            console.log('No changes after linting. Nothing to commit.');
        }
    })
    .catch((err) => {
        console.error(err);
    });
