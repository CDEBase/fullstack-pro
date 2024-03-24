const { execSync } = require('child_process');
const path = require('path');

const LERNA_JSON_PATH = path.join(__dirname, '../lerna.json');
const JENKINSFILE_PATH = path.join(__dirname, '../Jenkinsfile');
const CONFIG_FILE_PATH = path.join(__dirname, '../values-dev.yaml'); // Updated path

function runScript(scriptPath, args) {
    console.log(`Running script: ${scriptPath} with args: ${args}`);
    try {
        const output = execSync(`node ${scriptPath} ${args}`, { stdio: 'pipe' });
        console.log(output.toString());
    } catch (error) {
        console.error(`Error running script ${scriptPath}: ${error}`);
        process.exit(1);
    }
}

function main(versionArg) {
    console.log(`Updating to version: ${versionArg}`);

    // // Update lerna.json
    runScript('./deploy-cli/updateLernaVersion.js', `${LERNA_JSON_PATH} ${versionArg}`);

    // // Update Jenkinsfile
    runScript('./deploy-cli/updateJenkinsfileVersion.js', `${JENKINSFILE_PATH} ${versionArg}`);

    // Update configuration file
    runScript('./deploy-cli/updateYamlSettings.js', `${CONFIG_FILE_PATH} ${versionArg}`);
}

const versionArg = process.argv[2];

if (!versionArg || !versionArg.match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node deployVersionUpdate.js v[Major].[Minor]');
    process.exit(1);
}

main(versionArg);
