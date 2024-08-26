const fs = require('fs');

// Function to update the Jenkinsfile
function updateJenkinsfile(filePath, versionArg) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the Jenkinsfile: ${err}`);
            return;
        }

        // Extract the major and minor version (if present)
        const versionParts = versionArg.match(/^v(\d+)(\.(\d+))?$/);
        if (!versionParts) {
            console.error('Invalid version format. Please use the format v[Major].[Minor]');
            return;
        }
        const majorVersion = versionParts[1];
        const minorVersion = versionParts[3];
        const versionSuffix = minorVersion ? `${majorVersion}-${minorVersion}` : majorVersion;
        // Update the branch names using correct regular expressions
        const updatedData = data
            .replace(
                /string\(name: 'VERSION', defaultValue: '.*?', description: 'version of the deployment', trim: true\)/,
                `string(name: 'VERSION', defaultValue: 'v${versionSuffix}', description: 'version of the deployment', trim: true)`
            )
            .replace(
                /string\(name: 'REPOSITORY_BRANCH', defaultValue: 'develop', description: 'the branch with changes'\)/,
                `string(name: 'REPOSITORY_BRANCH', defaultValue: 'develop${versionSuffix}', description: 'the branch with changes')`,
            )
            .replace(
                /string\(name: 'DEVELOP_BRANCH', defaultValue: 'develop', description: 'the branch for the development'\)/,
                `string(name: 'DEVELOP_BRANCH', defaultValue: 'develop${versionSuffix}', description: 'the branch for the development')`,
            )
            .replace(
                /string\(name: 'PUBLISH_BRANCH', defaultValue: 'devpublish', description: 'the publish branch for packages release'\)/,
                `string(name: 'PUBLISH_BRANCH', defaultValue: 'devpublish${versionSuffix}', description: 'the publish branch for packages release')`,
            );

        // Debugging - Log the updated lines for verification
        console.log(updatedData.match(/(REPOSITORY_BRANCH|DEVELOP_BRANCH|PUBLISH_BRANCH).*?;/g));

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
