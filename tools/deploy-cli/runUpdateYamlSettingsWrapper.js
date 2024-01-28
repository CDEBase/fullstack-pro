const path = require('path');
const { exec } = require('child_process');

// Define the path to lerna.json relative to the tools directory
const DEV_YAML_SETTIGNS = path.join(__dirname, '../../values-dev.yaml');

// Function to call the updateConfiguration script
function runUpdateYamlSettings(version) {
    // Construct the path to the updateConfiguration script
    const updateScriptPath = path.join(__dirname, 'updateYamlSettings.js');

    // Construct the command to execute
    const command = `node ${updateScriptPath} ${DEV_YAML_SETTIGNS} ${version}`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
}

// Process command line arguments
const versionArg = process.argv[2];

if (!versionArg || !versionArg.match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node runUpdateVersionWrapper.js v[Major].[Minor]');
    process.exit(1);
}

// Call the function with the provided arguments
runUpdateYamlSettings(versionArg);
