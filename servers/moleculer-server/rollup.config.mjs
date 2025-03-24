import graphql from '@rollup/plugin-graphql';
import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';

const bundle = (config) => ({
    ...config,
    input: 'src/index.ts',
    // marking all node modules as external
    external: (id) => !/^[./]/.test(id),
});

export default [
    bundle({
        plugins: [
            typescript({}),
            graphql({
                include: '**/*.gql',
            }),
            string({
                include: ['**/*.ejs', '**/*.graphql'],
            }),
        ],
        output: [
            {
                dir: 'dist',
                format: 'es',
                name: 'MoleculerServer',
                compact: true,
                exports: 'named',
                sourcemap: false,
                preserveModules: true,
                chunkFileNames: '[name]-[hash].[format].js',
            },
        ],
    }),
];
