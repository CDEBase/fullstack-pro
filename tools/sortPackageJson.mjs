import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Function to define __dirname in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic import for sort-package-json
const sortPackageJson = await import('sort-package-json').then(module => module.default);

// Directories to process
const directories = [
  path.join(__dirname, '../'),
  path.join(__dirname, '../packages-modules'),
  path.join(__dirname, '../packages'),
  path.join(__dirname, '../servers'),
  path.join(__dirname, '../portable-devices')
];

// Function to sort a single package.json file
async function sortPackageJsonFile(filePath) {
  const packageJson = JSON.parse(await fsPromises.readFile(filePath, 'utf8'));
  const sortedPackageJson = sortPackageJson(packageJson);
  await fsPromises.writeFile(filePath, JSON.stringify(sortedPackageJson, null, 2) + '\n');
}

// Recursive function to sort all package.json files in a directory, skipping node_modules
async function sortAllPackageJsonFiles(dir) {
  const files = await fsPromises.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fsPromises.lstat(fullPath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      await sortAllPackageJsonFiles(fullPath);
    } else if (file === 'package.json') {
      await sortPackageJsonFile(fullPath);
      console.log(`Sorted ${fullPath}`);
    }
  }
}

// Function to process all directories
async function processDirectories(dirs) {
  for (const dir of dirs) {
    await sortAllPackageJsonFiles(dir);
  }
}

// Execute the sorting process
await processDirectories(directories);
