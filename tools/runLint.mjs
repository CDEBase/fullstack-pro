import { exec } from 'child_process';
import { resolve } from 'path';

export const runLintStaged = () => {
    return new Promise((resolve, reject) => {
        exec('yarn lint-staged', { cwd: resolve(import.meta.url, '../') }, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error running lint-staged: ${stderr}`);
                return reject(err);
            }
            console.log(stdout);
            resolve();
        });
    });
};
