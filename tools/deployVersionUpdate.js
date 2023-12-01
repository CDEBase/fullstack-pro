const { execSync } = require('child_process');
const path = require('path');

// Define file paths
const JENKINSFILE_PATH = path.join(__dirname, '../Jenkinsfile');
const CONFIG_FILE_PATH = path.join(__dirname, '../path/to/configFile.yaml');
const LERNA_JSON_PATH = path.join(__dirname, '../lerna.json');

function runScript(scriptPath, args) {
    try {
        execSync(`node ${scriptPath} ${args.join(' ')}`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error running script ${scriptPath}:`, error);
        process.exit(1);
    }
}

function gitOperations(version) {
    // Git operations as before
    // ...
}

function main() {
    const args = process.argv.slice(2);
    if (args.length !== 1 || !args[0].match(/^v\d+(\.\d+)?$/)) {
        console.error('Usage: node deployVersionUpdate.js v[Major].[Minor]');
        process.exit(1);
    }

    const [version] = args;

    // Paths to update scripts
    const updateLernaScript = path.join(__dirname, 'updateLernaVersion.js');
    const updateConfigScript = path.join(__dirname, 'updateConfiguration.js');
    const updateJenkinsfileScript = path.join(__dirname, 'updateJenkinsfile.js');

    // Run update scripts with predefined paths
    runScript(updateLernaScript, [version, LERNA_JSON_PATH]);
    runScript(updateConfigScript, [version, CONFIG_FILE_PATH]);
    runScript(updateJenkinsfileScript, [version, JENKINSFILE_PATH]);

    // Perform Git operations
    gitOperations(version);
}

main();
