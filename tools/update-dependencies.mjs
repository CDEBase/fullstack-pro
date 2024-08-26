import { exec } from 'child_process';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { runLintStaged } from './runLint.mjs'; // Assuming updateLint.mjs exports this function

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Constants for JSON formatting
const JSON_SPACING = 4;
const ADD_END_NEWLINE = true; // Set to true to add a newline at the end of the file

// Paths to package.json files
const backendPackagePath = resolve(__dirname, '../servers/backend-server/package.json');
const frontendPackagePath = resolve(__dirname, '../servers/frontend-server/package.json');

// Packages to check
const packagesToCheck = ['@common-stack/server-stack', '@common-stack/frontend-stack-react'];

// Function to update dependencies
const updateDependencies = async (targetPackagePath, sourcePackagePath) => {
    const targetPackageJson = JSON.parse(await readFile(targetPackagePath, 'utf-8'));
    const sourcePackageJson = JSON.parse(await readFile(sourcePackagePath, 'utf-8'));

    const mergeDependencies = (targetDeps = {}, sourceDeps = {}) => ({
        ...targetDeps,
        ...sourceDeps,
    });

    // Merge dependencies only
    targetPackageJson.dependencies = mergeDependencies(targetPackageJson.dependencies, sourcePackageJson.dependencies);

    // Format the JSON string with the specified spacing
    let jsonString = JSON.stringify(targetPackageJson, null, JSON_SPACING);

    // Optionally add a newline at the end
    if (ADD_END_NEWLINE) {
        jsonString += '\n';
    }

    // Write the formatted JSON back to disk
    await writeFile(targetPackagePath, jsonString, 'utf-8');
};

// Function to run `ncu`, update dependencies, and then run linting
export const runUpdateDependencies = async () => {
    // Run `ncu` command to update the dependencies from the root level
    await new Promise((resolve, reject) => {
        exec(
            'ncu -u -t minor "@common-stack*" && lerna exec "ncu -u -t minor /@common-stack*/"',
            { cwd: resolve(__dirname, '..') },
            (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error running ncu and lerna: ${stderr}`);
                    return reject(err);
                }
                console.log(stdout);
                resolve();
            },
        );
    });

    // Check for changes in the specified packages
    for (const packageName of packagesToCheck) {
        const packagePath = resolve(__dirname, `../node_modules/${packageName}/package.json`);
        try {
            await updateDependencies(
                packageName.includes('server-stack') ? backendPackagePath : frontendPackagePath,
                packagePath,
            );
        } catch (error) {
            console.warn(`Package ${packageName} not found or failed to update:`, error);
        }
    }

    console.log('Dependencies from @common-stack packages have been updated.');

    // Run linting to apply Prettier
    try {
        await runLintStaged();
        console.log('Prettier formatting applied.');
    } catch (err) {
        console.error('Failed to run Prettier:', err);
    }
};

// Execute the function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runUpdateDependencies().catch((err) => {
        console.error('Failed to update dependencies:', err);
        process.exit(1);
    });
}
