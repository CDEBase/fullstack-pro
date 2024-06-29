import * as fs from 'fs';
import * as path from 'path';
import { createFilter } from '@rollup/pluginutils';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

function findPackageJson(directory) {
    let currentDir = directory;
    while (currentDir !== path.parse(currentDir).root) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            return packageJsonPath;
        }
        console.log()
        currentDir = path.dirname(currentDir);
    }
    throw new Error(`No package.json found in path ${directory}`);
}

export default function extractImportsPlugin(options = {}) {
    // Create a filter to only include the desired files
    const filter = createFilter(options.include, options.exclude);
    const outputDir = options.outputDir || './lib'; // Default output directory

    return {
        name: 'extract-imports',

        transform(code, id) {
            // Skip files that do not match the filter
            if (!filter(id)) return null;
            console.log('---ID', id);

            let modified = false; // Flag to check if AST was modified

            console.log('--ID--', id);
            console.log('--COde', code);

            // Parse the code to an AST
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['tsx', 'dynamicImport'], // Ensure dynamicImport plugin is enabled
            });

            // Traverse the AST to find dynamic imports
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

                                const fullPath = path.resolve(path.dirname(id), importPath);

                                const packageJsonPath = findPackageJson(path.dirname(path.resolve(outputDir, importPath)));
                                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                                const relativePath = path.relative(path.dirname(packageJsonPath), fullPath);
                                const relativePathToOutputDir = path.relative(outputDir, path.resolve(path.dirname(id), importPath));
                                importPath = `${relativePathToOutputDir}.js`.replace(/\\/g, '/'); // Normalize path for Windows

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
                return {
                    code: output.code,
                    map: output.map, // Ensure source maps are handled correctly
                };
            }
            // This plugin doesn't modify the code, so return null
            return null;
        },
    };
}
