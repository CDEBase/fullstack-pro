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

const RouteModule = {
    action: 'action',
    hasAction: 'hasAction',
    clientAction: 'clientAction',
    hasClientAction: 'hasClientAction',
    clientLoader: 'clientLoader',
    hasClientLoader: 'hasClientLoader',
    Component: 'default', // default export
    hasComponent: 'hasComponent',
    ErrorBoundary: 'ErrorBoundary',
    hasErrorBoundary: 'hasErrorBoundary',
    handle: 'handle',
    hasHandle: 'hasHandle',
    headers: 'headers',
    hasHeaders: 'hasHeaders',
    HydrateFallback: 'HydrateFallback',
    hasHydrateFallback: 'hasHydrateFallback',
    links: 'links',
    hasLinks: 'hasLinks',
    loader: 'loader',
    hasLoader: 'hasLoader',
    meta: 'meta',
    hasMeta: 'hasMeta',
    shouldRevalidate: 'shouldRevalidate',
    hasShouldRevalidate: 'hasShouldRevalidate',
}


function modifyDeferReturn(filePath, loaderName) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ast = parse(fileContent, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
    });
    console.log('---MODIFY LOADER -- filepath', filePath, '---loaderName', loaderName);
    let modified = false; // flag to check if changes were made

    let deferKeys = [];
    traverse.default(ast, {
        // Handle all function types
        'FunctionDeclaration|ArrowFunctionExpression|FunctionExpression'(path) {
            // Check if this function is the loader by comparing the names or context
            let functionName = path.node.id ? path.node.id.name : null;
            if (!functionName && path.parent && path.parent.id) {
                functionName = path.parent.id.name; // For functions assigned to variables
            }
            // Match by function name or check if it's a default export or a direct export
            if (
                functionName === loaderName ||
                path.parent.type === 'ExportDefaultDeclaration' ||
                (path.parent.type === 'ExportNamedDeclaration' && path.parent.declaration === path.node)
            ) {
                // Traverse into the function body to look for ReturnStatement using defer
                path.traverse({
                    ReturnStatement(returnPath) {
                        if (
                            returnPath.node.argument &&
                            returnPath.node.argument.type === 'CallExpression' &&
                            returnPath.node.argument.callee.name === 'defer'
                        ) {
                            // Check if the first argument of defer is an object with properties to unwrap
                            if (
                                returnPath.node.argument.arguments.length > 0 &&
                                returnPath.node.argument.arguments[0].type === 'ObjectExpression' &&
                                returnPath.node.argument.arguments[0].properties.length > 0
                            ) {
                                const properties = returnPath.node.argument.arguments[0].properties;
                                const valuesArray = properties.map(prop => prop.value); // Map properties to their values

                                properties.forEach((prop) => {
                                    deferKeys.push(prop.key.name);
                                });
                                // Simplify the return statement to return the first property's value of the object
                                returnPath.node.argument = t.arrayExpression(valuesArray);

                                modified = true; // mark as modified
                            }
                        }
                    },
                });
            }
        },
    });

    if (modified) {
        const output = generate.default(ast, {}, fileContent);
        fs.writeFileSync(filePath, output.code);
        console.log(`Loader modified: ${filePath}`);
    } else {
        console.log(`No modifications made to: ${filePath}`);
    }
    return deferKeys;
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
                                    let hasClientLoader = false;
                                    let hasClientAction = false;
                                    let hasComponent = false;
                                    let hasErrorBoundary = false;
                                    let hasLinks = false;
                                    let hasMeta = false;
                                    let hasHydrateFallback = false;
                                    let hasShouldRevalidate = false;
                                    let hasHandle = false;
                                    let hasHeaders = false;
                                    let deferKeys = [];
                                    const fullPath = path.resolve(path.dirname(filePath), importPath);
                                    if (astroPath.node.key.name === 'component' && fs.existsSync(fullPath)) {
                                        const importedFileCode = fs.readFileSync(fullPath, 'utf8');
                                        const importedAst = parse(importedFileCode, {
                                            sourceType: 'module',
                                            plugins: ['typescript', 'jsx'],
                                        });

                                        traverse.default(importedAst, {
                                            ExportNamedDeclaration(namedPath) {
                                                namedPath.node.specifiers.forEach((specifier) => {
                                                    if (specifier.exported.name === RouteModule.loader) {
                                                        hasLoader = true;
                                                        let fullPathToLoader;
                                                        if (namedPath.node.source) {
                                                            // Handle re-exported loaders
                                                            const loaderSourcePath = namedPath.node.source.value; // Path of the module
                                                            fullPathToLoader = path.resolve(
                                                                path.dirname(fullPath),
                                                                loaderSourcePath,
                                                            );
                                                        } else {
                                                            fullPathToLoader = fullPath;
                                                        }
                                                        deferKeys = modifyDeferReturn(
                                                            fullPathToLoader,
                                                            specifier.local.name,
                                                        );
                                                    }
                                                    if (specifier.exported.name === RouteModule.action) {
                                                        hasAction = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.Component) {
                                                        hasComponent = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.ErrorBoundary) {
                                                        hasErrorBoundary = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.clientLoader) {
                                                        hasClientLoader = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.clientAction) {
                                                        hasClientAction = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.headers) {
                                                        hasHeaders = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.links) {
                                                        hasLinks = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.meta) {
                                                        hasMeta = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.shouldRevalidate) {
                                                        hasShouldRevalidate = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.HydrateFallback) {
                                                        hasHydrateFallback = true;
                                                    }
                                                    if (specifier.exported.name === RouteModule.handle) {
                                                        hasHandle = true;
                                                    }
                                                });
                                            },
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
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasLoader), t.booleanLiteral(true)),
                                            );
                                        }
                                        if (hasAction) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasAction), t.booleanLiteral(true)),
                                            );
                                        }
                                        if (hasClientLoader) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasClientLoader), t.booleanLiteral(true)),
                                            );
                                        }
                                        if (hasClientAction) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasClientAction), t.booleanLiteral(true)),
                                            );
                                        }
                                        if (hasComponent) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasComponent), t.booleanLiteral(true)),
                                            ); 
                                        }
                                        if (hasErrorBoundary) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasErrorBoundary), t.booleanLiteral(true)),
                                            ); 
                                        }
                                        if (hasHeaders) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasHeaders), t.booleanLiteral(true)),
                                            ); 
                                        }
                                        if (hasHydrateFallback) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasHydrateFallback), t.booleanLiteral(true)),
                                            ); 
                                        }
                                        if (hasMeta) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasMeta), t.booleanLiteral(true)),
                                            ); 
                                        }
                                        if (hasLinks) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasLinks), t.booleanLiteral(true)),
                                            ); 
                                        }
                                        if (hasHandle) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasHandle), t.booleanLiteral(true)),
                                            );  
                                        }
                                        if (hasShouldRevalidate) {
                                            parentObject.node.properties.push(
                                                t.objectProperty(t.identifier(RouteModule.hasShouldRevalidate), t.booleanLiteral(true)),
                                            ); 
                                        }
                                        if (deferKeys.length > 0) {
                                            const deferKeysArrayExpression = t.arrayExpression(
                                                deferKeys.map(key => t.stringLiteral(key))
                                            );
                                            parentObject.node.properties.push(
                                                t.objectProperty(
                                                    t.identifier('loaderDeferKeys'),
                                                    deferKeysArrayExpression,
                                                ),
                                            );
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
