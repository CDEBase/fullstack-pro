import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { promisify } from 'util';
import glob from 'glob';
import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const globPromise = promisify(glob.glob); // Make sure to call .glob here

export default function generateJsonFromSpecificFiles(options = {}) {
    const {
        pattern = '**/**/compute.js', // Pattern to match files
        dist = 'lib', // Default output directory
        outputFile = 'routes.json', // Output filename
    } = options;

    return {
        name: 'aggregate-compute-routes',
        async writeBundle() { // Changed from generateBundle to writeBundle
            console.log('Processing with pattern:', pattern, 'in directory:', dist);
            const files = await globPromise(path.join(dist, pattern), { absolute: true }); // Ensure paths are absolute
            const basePath = process.cwd();
            const relativeFiles = files.map(file => path.relative(basePath, file));
        
            // const files = await globPromise('./lib/redux-first-history/compute.js'); // Ensure paths are absolute
            console.log('files---', files)
            let allFilteredRoutes = [];

            for (const file of relativeFiles) {
                const relativePath = file.startsWith('.') ? file : `./${file}`;
                const baseRoutePath = path.dirname(pkg.name + relativePath.substring(1));
                
                try {
                    // Dynamically import the JS file assuming it exports filteredRoutes
                    const module = await import(relativePath); // file is already absolute
                    if (module.filteredRoutes) {
                        const newRoutes = module.filteredRoutes.map((filteredRoute) => {
                            let routConfig = Object.values(filteredRoute)[0];
                            if (routConfig.file) {
                                let filePath = routConfig.file.startsWith('./') ?
                                    baseRoutePath + '/' + routConfig.file.substring(2) : baseRoutePath + '/' + routConfig.file;
                                filePath = filePath.endsWith('.js') ? filePath : filePath + '.js';
                                routConfig = {
                                    ...routConfig,
                                    file: filePath,
                                    module: pkg.name,
                                }
                            }
                            return { [routConfig.key]: routConfig };
                        });
                        allFilteredRoutes.push(...newRoutes);
                    }
                } catch (error) {
                    this.warn(`Error importing ${file}: ${error}`);
                }
            }

            // Ensure the dist directory exists
            if (!fs.existsSync(dist)) {
                fs.mkdirSync(dist, { recursive: true });
            }

            // Specify the output file path and write the aggregated filteredRoutes to a JSON file
            const outputPath = path.join(dist, outputFile);
            fs.writeFileSync(outputPath, JSON.stringify(allFilteredRoutes, null, 2), 'utf8');
            console.log(`Aggregated filtered routes have been written to ${outputPath}`);
        },
    };
}
