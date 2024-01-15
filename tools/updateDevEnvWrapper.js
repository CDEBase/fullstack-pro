const path = require('path');
const { exec } = require('child_process');

// Function to call the updateConfiguration script
function updateConfig(version, configFilename) {
    // Construct the path to the updateConfiguration script
    const updateScriptPath = path.join(__dirname, 'updateEnv.js');

    // Construct the command to execute
    const command = `node ${updateScriptPath} ${version} ${configFilename}`;

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
const args = process.argv.slice(2);
if (args.length !== 2 || !args[0].match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node updateConfigWrapper.js v[Major].[Minor] filename');
    process.exit(1);
}

// Extract arguments
const [version, configFilename] = args;

// Call the function with the provided arguments
updateConfig(version, configFilename);
