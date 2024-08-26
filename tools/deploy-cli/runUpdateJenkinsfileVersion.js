const { exec } = require('child_process');
const path = require('path');

// Use __dirname to get the directory of the current script and specify the relative path to the Jenkinsfile
const jenkinsfilePath = path.join(__dirname, '../../Jenkinsfile'); // Replace with your actual Jenkinsfile relative path

// Function to run the update script
function runUpdateScript(versionArg) {
    exec(`node ${path.join(__dirname, 'updateJenkinsfileVersion.js')} ${jenkinsfilePath} ${versionArg}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });
}

// Process command line arguments
const versionArg = process.argv[2];

if (!versionArg || !versionArg.match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node runUpdateJenkinsfileVersion.js v[Major].[Minor]');
    process.exit(1);
}

runUpdateScript(versionArg);
