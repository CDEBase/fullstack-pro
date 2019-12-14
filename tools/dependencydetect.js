const glob = require("glob");
const fs = require('fs');

const folder = '../servers';

glob(`${folder}/**/package.json`, null, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err);

    files.forEach(file => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) return console.log('Unable to scan directory: ' + err);

            console.log(JSON.parse(data));
        });
    });
})

