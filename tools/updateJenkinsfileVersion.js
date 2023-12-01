const fs = require('fs');

function updateJenkinsfile(filePath, versionArg) {
    // Read the existing Jenkinsfile
    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        // Determine the branch names
        const majorVersion = versionArg.match(/^v(\d+)(\.\d+)?$/)[1];
        const minorVersion = versionArg.match(/^v\d+(\.\d+)?$/)[2] || '';
        const developBranch = `develop${majorVersion}${minorVersion}`;
        const publishBranch = `devpublish${majorVersion}${minorVersion}`;

        // Update Jenkinsfile content
        let updatedData = data.replace(/(string\(name: 'VERSION', defaultValue: ')([^']+)/, `$1${versionArg}`);
        updatedData = updatedData.replace(/(string\(name: 'DEVELOP_BRANCH', defaultValue: ')([^']+)/, `$1${developBranch}`);
        updatedData = updatedData.replace(/(string\(name: 'REPOSITORY_BRANCH', defaultValue: ')([^']+)/, `$1${developBranch}`);
        updatedData = updatedData.replace(/(string\(name: 'PUBLISH_BRANCH', defaultValue: ')([^']+)/, `$1${publishBranch}`);

        // Write the updated Jenkinsfile
        fs.writeFile(filePath, updatedData, 'utf8', writeErr => {
            if (writeErr) {
                console.error(`Error writing file: ${writeErr}`);
                return;
            }
            console.log(`Jenkinsfile updated successfully with version ${versionArg}, develop branch ${developBranch}, and publish branch ${publishBranch}`);
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
