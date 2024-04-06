// rollup.config.base.js
import graphql from '@rollup/plugin-graphql';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { copy } from '@web/rollup-plugin-copy';
import modifyLibFilesPlugin from './rollupPluginModifyLibFiles.mjs';
import generateJsonFromObject from './rollupPluginGenerateJson.mjs';
// Define any additional plugins specific to this bundle
const additionalPlugins = [
    copy({ patterns: '**/cdm-locales/**/*', rootDir: './src' })
];

// Optional: Define commonly used custom plugins/functions if applicable
function appendJsExtensionForMonacoEditor() {
    return {
        name: 'append-js-extension-for-monaco-editor',
        transform(code, id) {
            if (id.includes('node_modules') || !id.endsWith('.ts')) {
                return null;
            }
            const monacoImportRegex = /(@vscode-alt\/monaco-editor\/esm\/vs\/[a-zA-Z0-9\/._-]+)(?<!\.js)('|")/g;
            return {
                code: code.replace(monacoImportRegex, `$1.js$2`),
                map: null,
            };
        },
    };
}

const addJsExtensionToImportsPlugin = () => {
    return {
        name: 'add-js-extension-to-imports',
        transform(code, id) {
            // Only apply the transformation to .js files
            if (!/\.tsx?$/.test(id)) return null; 

            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx'], // Adjusted to 'typescript' for .tsx files
            });

            traverse.default(ast, {
                ImportDeclaration(path) {
                    const source = path.node.source.value;
                    // Example condition: add ".js" to imports from specific paths or packages
                    if (source.startsWith('@react-icons/all-files') && !source.endsWith('.js')) {
                        console.log('Updating import:', source);
                        path.node.source.value = `${source}.js`;
                    } // Specifically for '@apollo/client', append "index.js"
                    else if (source === '@apollo/client' || source === '@apollo/client/') {
                        console.log('Updating import for @apollo/client:', source);
                        // Ensure the path ends with "index.js", adjusting for whether there's a trailing slash
                        path.node.source.value = source.endsWith('/') ? `${source}index.js` : `${source}/index.js`;
                    }
                },
            });

            const output = generate.default(ast, {}, code);
            return {
                code: output.code,
                map: output.map,
            };
        },
    };
};

function deepMergeConfigs(baseConfig, specificConfig) {
    const mergedConfig = { ...baseConfig, ...specificConfig };

    // Assuming both configs have a plugins array; adjust logic as needed
    if (baseConfig.plugins && specificConfig.plugins) {
        mergedConfig.plugins = [...baseConfig.plugins, ...specificConfig.plugins];
    }

    return mergedConfig;
}

// Base configuration
const baseConfig = {
    plugins: [
        addJsExtensionToImportsPlugin(),
        image(),
        graphql({ include: '**/*.gql' }),
        string({ include: '**/*.graphql' }),
        appendJsExtensionForMonacoEditor(),
        typescript({ noEmitOnError: true }), // TypeScript at the top as per best practices
        modifyLibFilesPlugin({
            include: ['**/**/compute.js'], // Adjust to target specific files or patterns
            outputDir: 'lib', // Ensure this matches your actual output directory
        }),
        generateJsonFromObject({}),
        ...additionalPlugins,
    ],
    external: (id) => !/^[./]/.test(id),
    globals: { react: 'React' },
};

// Function to create a configuration by extending the base
function createRollupConfig(overrides) {
    return deepMergeConfigs(baseConfig, overrides);
}

export { createRollupConfig, baseConfig };
