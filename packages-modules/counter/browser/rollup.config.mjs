import { createRollupConfig } from '../../../rollup.config.base.mjs';
import json from '@rollup/plugin-json';
// Define any additional plugins specific to this bundle
const additionalPlugins = [
    json()
];

// Use the createRollupConfig function to merge the base and specific configurations
export default [
    createRollupConfig({
        input: ['src/index.ts'],
        plugins: [
            // Spread in additional plugins specific to this config
            ...additionalPlugins,
           
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
                globals: { react: 'React' },
            },
        ],
    }),
];