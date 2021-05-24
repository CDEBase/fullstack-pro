import graphql from '@rollup/plugin-graphql';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';

const bundle = (config) => ({
    ...config,
    input: 'src/index.ts',
    // marking all node modules as external
    external: (id) => !/^[./]/.test(id),
});
const globals = { react: 'React' };

export default [
    bundle({
        plugins: [typescript({}), image(), graphql()],
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
