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
    while (currentDir && currentDir !== path.parse(currentDir).root) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            return packageJsonPath;
        }
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

        async writeBundle(outputOptions) {
            const currentWorkingDir = process.cwd();
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
                        if (
                            astroPath.isObjectProperty() &&
                            (astroPath.node.key.name === 'component' || astroPath.node.key.name === 'dialog')
                        ) {
                            const importDeclaration = astroPath.node.value;
                            const propName = astroPath.node.key.name;

                            if (
                                importDeclaration.type === 'ArrowFunctionExpression' &&
                                importDeclaration.body.type === 'CallExpression' &&
                                importDeclaration.body.callee.type === 'Import'
                            ) {
                                const importArg = importDeclaration.body.arguments[0];

                                // Ensure we're dealing with a string literal import path
                                if (importArg.type === 'StringLiteral') {
                                    let importPath = importArg.value;
                                    let hasLoader = false;
                                    let hasAction = false;
                                    const fullPath = path.resolve(path.dirname(filePath), importPath);
                                    if(astroPath.node.key.name === 'component' && fs.existsSync(fullPath)) {
                                        const importedFileCode = fs.readFileSync(fullPath, 'utf8');
                                        const importedAst = parse(importedFileCode, {
                                            sourceType: 'module',
                                            plugins: ['typescript', 'jsx'],
                                        });

        
                                        traverse.default(importedAst, {
                                            ExportNamedDeclaration(namedPath) {
                                                namedPath.node.specifiers.forEach(specifier => {
                                                    if (specifier.exported.name === 'loader') {
                                                        hasLoader = true;
                                                    }
                                                    if (specifier.exported.name === 'action') {
                                                        hasAction = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    const packageJsonPath = findPackageJson(
                                        path.dirname(path.resolve(process.cwd(), dist)),
                                    );
                                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                                    const relativePath = path.relative(path.dirname(packageJsonPath), fullPath);
                                    const normalizedImportPath = relativePath.replace(/\\/g, '/'); // Normalize path for Windows

                                    const newImportPath = `${packageJson.name}/${normalizedImportPath}`;

                                    // Create a new `file` property
                                    const fileProperty = t.objectProperty(
                                        t.identifier(`${propName}Path`),
                                        t.stringLiteral(newImportPath),
                                    );

                                    // Get the parent object expression to add the new property
                                    const parentObject = astroPath.findParent((p) => p.isObjectExpression());
                                    if (parentObject) {
                                        // remove component
                                        astroPath.remove(); 
                                        parentObject.node.properties.push(fileProperty);
                                        if (hasLoader) {
                                            parentObject.node.properties.push(t.objectProperty(t.identifier('loader'), t.booleanLiteral(true)));
                                        }
                                        if (hasAction) {
                                            parentObject.node.properties.push(t.objectProperty(t.identifier('action'), t.booleanLiteral(true)));
                                        }
                                        modified = true; // Mark as modified
                                    }
                                }
                            }
                        } else if (
                            astroPath.node.key &&
                            astroPath.node.key.name === 'wrappers' &&
                            astroPath.node.value.type === 'ArrayExpression'
                        ) {
                            const parentObjectExpression = astroPath.findParent((p) => p.isObjectExpression());
                            const wrapperPaths = [];
                            astroPath.node.value.elements.forEach((element, index) => {
                                if (element.type === 'CallExpression' && element.callee.type === 'Import') {
                                    const importArg = element.arguments[0];
                                    if (importArg && importArg.type === 'StringLiteral') {
                                        const importPath = importArg.value;
                                        const fullPath = path.resolve(path.dirname(filePath), importPath);
                                        const packageJsonPath = findPackageJson(
                                            path.dirname(path.resolve(process.cwd(), dist)),
                                        );
                                        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                                        const relativePath = path.relative(path.dirname(packageJsonPath), fullPath);
                                        const normalizedImportPath = `${packageJson.name}/${relativePath.replace(
                                            /\\/g,
                                            '/',
                                        )}`;
                                        // Modify the import path directly
                                        element.arguments[0] = t.stringLiteral(normalizedImportPath);

                                        wrapperPaths.push(normalizedImportPath);

                                        if (wrapperPaths.length > 0) {
                                            // Construct an array expression for the wrapper paths
                                            const wrapperPathsArrayExpression = t.arrayExpression(
                                                wrapperPaths.map((path) => t.stringLiteral(path)),
                                            );
                                            // Create an object property AST node for `wrapperPaths`
                                            const wrapperPathsProperty = t.objectProperty(
                                                t.identifier('wrapperPaths'), // Property key
                                                wrapperPathsArrayExpression, // Property value
                                            );
                                            astroPath.remove(); 
                                            // Ensure the parent object expression exists and has properties
                                            if (
                                                parentObjectExpression &&
                                                parentObjectExpression.node &&
                                                parentObjectExpression.node.properties
                                            ) {
                                                // Push the new property into the parent object's properties array
                                                parentObjectExpression.node.properties.push(wrapperPathsProperty);
                                                modified = true; // Mark as modified
                                            }
                                        }
                                    }
                                }
                            });
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
