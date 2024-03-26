import graphql from '@rollup/plugin-graphql';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import * as path from 'path';
import { fileURLToPath } from 'url';
import generateJsonFromObject from './generate-json-from-object-plugin.mjs';

const bundle = (config) => ({
    ...config,
    input: [
        './src/index.ts',
        './src/redux-first-history/compute.tsx',
        './src/apollo-server-n-client/compute.tsx',
        './src/common/compute.tsx',
        './src/redux-first-history/compute.tsx',
    ],
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
            generateJsonFromObject({
                // include: ['src/**/*.tsx'], // Adjust this pattern to match your files
                // You can also exclude files if necessary
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
