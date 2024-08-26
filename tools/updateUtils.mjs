import { resolve, dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import glob from 'glob';

export const JSON_SPACING = 4;
export const ADD_END_NEWLINE = true; // Set to true to add a newline at the end of the file

export const monorepoRoot = resolve(dirname(import.meta.url), '..');

export const findPackageJsonFiles = () => {
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

export const buildPackageMap = async () => {
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

export const searchAndUpdate = (dependencies, filePath, obj, packageMap) => {
    let modified = false;

    for (const key in dependencies) {
        if (dependencies[key].startsWith('link:')) {
            const relativeDepFolder = dependencies[key].split('link:')[1];
            const dependencyFolder = join(dirname(filePath), relativeDepFolder);

            try {
                const packageJsonPath = join(dependencyFolder, 'package.json');
                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
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
        let formattedJson = JSON.stringify(obj, null, JSON_SPACING);
        if (ADD_END_NEWLINE) {
            formattedJson += '\n';
        }
        writeFileSync(filePath, formattedJson, 'utf8');
    }

    return modified;
};
