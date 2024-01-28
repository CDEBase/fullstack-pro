const { exec } = require('child_process');
const path = require('path');

// Define the path to lerna.json relative to the tools directory
const LERNA_JSON_PATH = path.join(__dirname, '../../lerna.json'); // Update this to the actual relative path of your lerna.json file

function runUpdateVersion(versionArg) {
    const scriptPath = path.join(__dirname, 'updateLernaVersion.js');

    exec(`node ${scriptPath} ${LERNA_JSON_PATH} ${versionArg}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Execution error: ${err}`);
            return;
        }

        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }

        console.log(stdout);
    });
}

const versionArg = process.argv[2];

if (!versionArg || !versionArg.match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node runUpdateVersionWrapper.js v[Major].[Minor]');
    process.exit(1);
}

runUpdateVersion(versionArg);
