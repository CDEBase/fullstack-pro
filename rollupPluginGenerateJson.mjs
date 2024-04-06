import { promisify } from 'util';
import glob from 'glob';
import fs from 'fs';
import path from 'path';

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
            const files = await globPromise(path.join(dist, pattern), { absolute: true }); // Ensure paths are absolute
            let allFilteredRoutes = [];

            for (const file of files) {
                try {
                    // Dynamically import the JS file assuming it exports filteredRoutes
                    const module = await import(file); // file is already absolute
                    if (module.filteredRoutes) {
                        const newRoutes = module.filteredRoutes.map((filteredRoute) => {
                            let routConfig = Object.values(filteredRoute)[0];
                            return { [routConfig.path]: routConfig };
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
