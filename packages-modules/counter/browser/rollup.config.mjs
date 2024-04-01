import graphql from '@rollup/plugin-graphql';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import * as path from 'path';
import { fileURLToPath } from 'url';
import generateJsonFromObject from './generate-json-from-object-plugin.mjs';
import modifyLibFilesPlugin from './modifyLibFilesPlugin.mjs';

const bundle = (config) => ({
    ...config,
    input: ['./src/index.ts'],
    // marking all node modules as external
    external: (id) => !/^[./]/.test(id),
});
const globals = { react: 'React' };

export default [
    bundle({
        plugins: [
            image(),
            graphql({
                include: '**/*.gql',
            }),
            string({
                include: '**/*.graphql',
            }),
            typescript({ noEmitOnError: true }),
            modifyLibFilesPlugin({
                include: ['**/**/compute.js'], // Adjust to target specific files or patterns
                outputDir: 'lib', // Ensure this matches your actual output directory
            }),
            generateJsonFromObject({
            }),
        ],
        output: [
            {
                dir: 'lib',
                format: 'es',
                name: 'Counter',
                compact: true,
                exports: 'named',
                sourcemap: true,
                preserveModules: true,
                chunkFileNames: '[name]-[hash].[format].js',
                globals,
            },
        ],
    }),
];
