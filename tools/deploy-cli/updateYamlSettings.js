/* eslint-disable jest/require-hook */
const fs = require('fs');

// Function to update the configuration file
function updateConfiguration(filePath, newVersion) {
    // Read the configuration file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${err.message}`);
            return;
        }

        // Replace VERSION and CONNECTION_ID with newVersion
        let updatedData = data
            .replace(/VERSION: v\d+(\.\d+)?/g, `VERSION: ${newVersion}`)
            .replace(/CONNECTION_ID: v\d+(\.\d+)?/g, `CONNECTION_ID: ${newVersion}`);

        // Update CLIENT_URL
        updatedData = updatedData.replace(
            /CLIENT_URL: "https:\/\/[\w-]+-v\d+(\.\d+)?\.[\w-]+(\.\w+)?\/?"/g,
            (match) => {
                const domainParts = match.match(/https:\/\/[\w-]+-v\d+(\.\d+)?(\.[\w-]+)+/g);
                if (domainParts && domainParts.length > 0) {
                    const domain = domainParts[0];
                    const newDomain = domain.replace(/-v\d+(\.\d+)?/, `-${newVersion}`);
                    return match.replace(domain, newDomain);
                }
                return match;
            },
        );
        // Write the updated configuration back to the file
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing to the file: ${err.message}`);
                return;
            }
            console.log(`Configuration file updated successfully.`);
            console.log(`Manually update CLIENT_URL in values-dev.yaml and values-prod.yaml`)
        });
    });
}

// Process command line arguments
const filePath = process.argv[2];
const versionArg = process.argv[3];

if (!filePath || !versionArg || !versionArg.match(/^v\d+(\.\d+)?$/)) {
    console.error('Usage: node updateConfiguration.js v[Major].[Minor]');
    process.exit(1);
}

// Call the function with the provided version argument
updateConfiguration(filePath, versionArg);
