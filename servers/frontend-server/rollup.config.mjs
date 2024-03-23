import graphql from '@rollup/plugin-graphql';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import codegen from 'rollup-plugin-codegen';

const bundle = (config) => ({
    ...config,
    input: 'src/routes/.codegen',
});
const globals = { react: 'React' };

export default [
    bundle({
        plugins: [
            codegen.default(),
            // typescript({ noEmitOnError: true }),
        ],
        output: [
            {
                dir: 'lib',
                format: 'es',
                name: 'Routes',
                // compact: true,
                // exports: 'named',
                // sourcemap: true,
                // preserveModules: true,
                // chunkFileNames: '[name]-[hash].[format].js',
                // globals,
            },
        ],
    }),
];
