const path = require('path');
const { exec } = require('child_process');

// Function to call the updateConfiguration script
function runUpdateYamlSettings(version) {
    // Construct the path to the updateConfiguration script
    const updateScriptPath = path.join(__dirname, 'updateYamlSettings.js');

    // Construct the command to execute
    const command = `node ${updateScriptPath} ${version}`;

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
    console.error('Usage: node updateVersionWrapper.js v[Major].[Minor]');
    process.exit(1);
}

// Call the function with the provided arguments
runUpdateYamlSettings(versionArg);
