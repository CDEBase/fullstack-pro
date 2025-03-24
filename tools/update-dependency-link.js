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
const simpleGit = require('simple-git');

const git = simpleGit();

const monorepoRoot = path.resolve(__dirname, '..');

const findPackageJsonFiles = () => {
  return new Promise((resolve, reject) => {
    glob(
      `${monorepoRoot}/+(servers|portable-devices|packages|packages-modules)/**/package.json`,
      { onlyFiles: false, ignore: '**/node_modules/**' },
      (err, files) => {
        if (err) reject(`Unable to scan directory: ${err}`);
        resolve(files);
      }
    );
  });
};

const buildPackageMap = async () => {
  const packageJsonFiles = await findPackageJsonFiles();
  const packageMap = new Map();

  packageJsonFiles.forEach(file => {
    const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (packageJson.name) {
      packageMap.set(packageJson.name, path.dirname(file));
    }
  });

  return packageMap;
};

const searchAndUpdate = (dependencies, filePath, obj, packageMap) => {
  const packageDir = path.dirname(filePath);

  for (const key in dependencies) {
    if (packageMap.has(key)) {
      const targetDir = packageMap.get(key);
      const relativePath = path.relative(packageDir, targetDir);
      dependencies[key] = `link:${relativePath}`;
      const str = JSON.stringify(obj, null, 2);
      fs.writeFileSync(filePath, str, 'utf8');
    }
  }
};

const updateDependencies = async () => {
  const packageMap = await buildPackageMap();
  const packageJsonFiles = await findPackageJsonFiles();

  packageJsonFiles.forEach(file => {
    if (!file.includes('node_modules')) {
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) return console.error(`Unable to scan directory: ${err}`);
        try {
          const obj = JSON.parse(data);
          const { dependencies, peerDependencies, devDependencies } = obj;
          searchAndUpdate(dependencies, file, obj, packageMap);
          searchAndUpdate(peerDependencies, file, obj, packageMap);
          searchAndUpdate(devDependencies, file, obj, packageMap);
        } catch (err) {
          console.error(`Errored at ${file}`);
          console.error(err);
        }
      });
    }
  });
};

updateDependencies().then(() => {
  git.add('.')
    .then(() => {
      git.status()
        .then(status => {
          console.log('POST GIT CHANGES', status);
          if (status.modified.length) {
            const fileArray = status.modified.filter(element => element.includes('package.json'));
            const addArray = fileArray.map(element => `./${element}`);
            git.add(addArray);
            git.commit('Updated packages to use link for monorepo dependencies');
          } else {
            console.log('no change');
          }
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => console.error(err));
}).catch(err => console.error(err));
