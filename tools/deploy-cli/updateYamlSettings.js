/* eslint-disable jest/require-hook */
const fs = require('fs');

// Function to update the configuration file
function updateConfiguration(filePath, newVersion) {
    // Convert the version from vMajor.Minor to vMajor-Minor for URL
    const versionForUrl = newVersion.replace('.', '-');

    // Read the configuration file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${err.message}`);
            return;
        }

        // Replace only the specific VERSION and CONNECTION_ID fields, preserving leading whitespace
        let updatedData = data
            .replace(/^(\s*)VERSION:\s*v\d+(\.\d+)?/gm, `$1VERSION: ${newVersion}`)
            .replace(/^(\s*)CONNECTION_ID:\s*v\d+(\.\d+)?/gm, `$1CONNECTION_ID: ${newVersion}`);

        // Update CLIENT_URL, preserving leading whitespace, and replacing the version with the hyphenated version
        updatedData = updatedData.replace(
            /^(\s*)CLIENT_URL:\s*"https:\/\/([\w-]+)-v\d+(-\d+)?(\.[\w-]+(\.\w+)?)\/?"/gm,
            (match, p1, p2, p3, p4) => {
                const newDomain = `${p2}-${versionForUrl}${p4}`;
                return `${p1}CLIENT_URL: "https://${newDomain}"`;
            },
        );

        // Write the updated configuration back to the file
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing to the file: ${err.message}`);
                return;
            }
            console.log(`Configuration file updated successfully.`);
            console.log(`Manually update CLIENT_URL in values-dev.yaml and values-prod.yaml`);
        });
    });
}

// Process command line arguments
const filePath = process.argv[2];
const versionArg = process.argv[3];

if (!filePath || !versionArg || !versionArg.match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node updateConfiguration.js <path-to-config> v[Major].[Minor]');
    process.exit(1);
}

// Call the function with the provided version argument
updateConfiguration(filePath, versionArg);
