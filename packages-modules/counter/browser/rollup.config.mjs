import { createRollupConfig } from '../../../rollup.config.base.mjs';

const additionalPlugins = [];
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
                name: 'Accounts',
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