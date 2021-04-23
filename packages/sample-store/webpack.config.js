const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

function globEntries1(globPath) {
    const files = glob.sync(globPath);
    const entries = {};

    for (let i = 0; i < files.length; i += 1) {
        const entry = files[i];
        const pathObj = path.parse(entry);
        entries[
            path.join(
                pathObj.dir.replace(
                    new RegExp('^./src/database-store', ''),
                    'store',
                ),
                pathObj.name,
            )
        ] = entry;
    }
    return entries;
}

const webpackOpts = {
    mode: 'development',
    entry: {
        index: './src/index.ts',
        ...globEntries1('./src/database-store/**/*.ts'),
    },
    target: 'node',
    output: {
        path: path.join(__dirname, 'lib'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        library: '@sample-stack/store',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                test: /\.ts$/,
                ts: {
                    compiler: 'typescript',
                    configFile: 'tsconfig.json',
                },
                tslint: {
                    emitErrors: true,
                    failOnHint: true,
                },
            },
        }),
    ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: 'ts-loader',
            },
        ],
    },
    externals: [
        nodeExternals({ modulesDir: '../../node_modules' }),
        nodeExternals(),
    ],
};

module.exports = webpackOpts;
