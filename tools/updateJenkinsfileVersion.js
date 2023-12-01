const fs = require('fs');

// Function to update the Jenkinsfile
function updateJenkinsfile(filePath, versionArg) {
    // Read the Jenkinsfile
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the Jenkinsfile: ${err}`);
            return;
        }

        // Extract the major and minor version (if present)
        const versionParts = versionArg.match(/^v(\d+)(\.(\d+))?$/);
        const majorVersion = versionParts[1];
        const minorVersion = versionParts[3] || '0';
        const versionSuffix = `${majorVersion}.${minorVersion}`;

        // Update the branch names
        let updatedData = data
            .replace(/(REPOSITORY_BRANCH = 'develop)(\d+(\.\d+)?)'/, `$1${versionSuffix}'`)
            .replace(/(DEVELOP_BRANCH = 'develop)(\d+(\.\d+)?)'/, `$1${versionSuffix}'`)
            .replace(/(PUBLISH_BRANCH = 'devpublish)(\d+(\.\d+)?)'/, `$1${versionSuffix}'`);

        // Write the updated Jenkinsfile back
        fs.writeFile(filePath, updatedData, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(`Error writing the Jenkinsfile: ${writeErr}`);
                return;
            }
            console.log(`Jenkinsfile updated successfully for version ${versionArg}.`);
        });
    });
}

// Process command line arguments
const filePath = process.argv[2];
const versionArg = process.argv[3];

if (!filePath || !versionArg || !versionArg.match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node updateJenkinsfileVersion.js <path-to-Jenkinsfile> v[Major].[Minor]');
    process.exit(1);
}

updateJenkinsfile(filePath, versionArg);
