import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { promisify } from 'util';
import glob from 'glob';
import { createFilter } from '@rollup/pluginutils';
const globPromise = promisify(glob.glob); // Make sure to call .glob here

function findPackageJson(directory) {
    let currentDir = directory;
    while (currentDir !== path.parse(currentDir).root) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            return packageJsonPath;
        }
        console.log();
        currentDir = path.dirname(currentDir);
    }
    throw new Error(`No package.json found in path ${directory}`);
}

export default function modifyLibFilesPlugin(options = {}) {
    // Create a filter to only include the desired files
    const filter = createFilter(options.include, options.exclude);
    const dist = options.outputDir || './lib'; // Default output directory
    const pattern = '**/**/compute.js'; // Pattern to match files
    return {
        name: 'modify-lib-files',

        async writeBundle() {
            // Assuming you want to modify specific files, list them here
            const filesToModify = await globPromise(path.join(dist, pattern), { absolute: true }); // Ensure paths are absolute
            filesToModify.forEach((filePath) => {
                if (!filter(filePath)) return; // Skip files that do not match the filter

                // Read the file content
                const code = fs.readFileSync(filePath, 'utf8');
                // Parse the code to an AST
                const ast = parse(code, {
                    sourceType: 'module',
                    plugins: ['js', 'dynamicImport'], // Adjust plugins as necessary
                });

                // Traverse and modify the AST as needed
                let modified = false;
                traverse.default(ast, {
                    enter(astroPath) {
                        // Adjust this part to target the specific objects and properties in your AST
                        if (astroPath.isObjectProperty() && astroPath.node.key.name === 'component') {
                            const componentValue = astroPath.node.value;

                            if (
                                componentValue.type === 'ArrowFunctionExpression' &&
                                componentValue.body.type === 'CallExpression' &&
                                componentValue.body.callee.type === 'Import'
                            ) {
                                const importArg = componentValue.body.arguments[0];

                                // Ensure we're dealing with a string literal import path
                                if (importArg.type === 'StringLiteral') {
                                    let importPath = importArg.value;

                                    const fullPath = path.resolve(path.dirname(filePath), importPath);

                                    const packageJsonPath = findPackageJson(
                                        path.dirname(path.resolve(dist, importPath)),
                                    );
                                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                                    const relativePath = path.relative(path.dirname(packageJsonPath), fullPath);
                                    importPath = relativePath.replace(/\\/g, '/'); // Normalize path for Windows

                                    const newImportPath = `${packageJson.name}/${importPath}`;

                                    // Create a new `file` property
                                    const fileProperty = t.objectProperty(
                                        t.identifier('file'),
                                        t.stringLiteral(newImportPath),
                                    );

                                    // Get the parent object expression to add the new property
                                    const parentObject = astroPath.findParent((p) => p.isObjectExpression());
                                    if (parentObject) {
                                        parentObject.node.properties.push(fileProperty);
                                        modified = true; // Mark as modified
                                    }
                                }
                            }
                        }
                    },
                });
                // If AST was modified, regenerate code
                if (modified) {
                    const output = generate.default(
                        ast,
                        {
                            /* options */
                        },
                        code,
                    );
                    fs.writeFileSync(filePath, output.code); // This line actually writes the changes
                }
                // This plugin doesn't modify the code, so return null
                return null;
            });
        },
    };
}
