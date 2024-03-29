import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import path from 'path';
import { dirname, join, resolve } from 'path';

// Utility to find the nearest package.json
function findNearestPackageJson(directory) {
  let currentDirectory = directory;
  while (!existsSync(join(currentDirectory, 'package.json'))) {
    const parentDirectory = dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      throw new Error('No package.json found');
    }
    currentDirectory = parentDirectory;
  }
  return join(currentDirectory, 'package.json');
}


export default function processComputeFile(opts) {
    const { basePath = process.cwd() } = opts; // Base path to resolve imports

    return {
        name: 'process-compute-file',
        generateBundle(opts) {
            const computeFilePath = path.join(opts.dir, 'compute.js');
            const code = readFileSync(computeFilePath, 'utf8');
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['jsx'],
            });

            traverse(ast, {
                enter(path) {
                    if (path.isVariableDeclarator() && path.node.id.name === 'counterPageStore') {
                        path.node.init.elements.forEach((element) => {
                            const componentProp = element.properties.find((prop) => prop.key.name === 'component');
                            if (componentProp && componentProp.value.body.type === 'CallExpression') {
                                const importPath = componentProp.value.body.arguments[0].value;
                                const moduleProp = t.objectProperty(
                                    t.identifier('module'),
                                    t.stringLiteral('<package_name>'),
                                );
                                const fileProp = t.objectProperty(t.identifier('file'), t.stringLiteral(importPath));
                                element.properties.push(moduleProp, fileProp);
                            }
                        });
                    }
                },
            });

            const output = generate(ast, {}, code);
            writeFileSync(computeFilePath, output.code);
            console.log(`Updated ${computeFilePath}`);
        },
    };
}
