const glob = require('glob');
const fs = require('fs');
const folder = '../servers/**/';

glob(`${folder}package.json`, null, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err);

    files.forEach(file => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) return console.log('Unable to scan directory: ' + err);
            const obj = JSON.parse(data);
            const { dependencies } = obj;
            for (let key in dependencies) {
                if (dependencies[key].includes('file')){
                    dependencies[key] = '^0.0.1';
                    const str = JSON.stringify(obj, null, 2);
                    fs.writeFileSync(file, `${str}`,  'ascii');
                }
            }
        });
    });
})

