// rollup.config.base.js
import graphql from '@rollup/plugin-graphql';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import { copy } from '@web/rollup-plugin-copy';
import modifyLibFilesPlugin from '@common-stack/rollup-vite-utils/lib/rollup/rollupPluginModifyLibFiles.js';
import generateJsonFromObject from '@common-stack/rollup-vite-utils/lib/rollup/rollupPluginGenerateJson.js';
import addJsExtensionToImportsPlugin from '@common-stack/rollup-vite-utils/lib/rollup/rollupPluginAddJsExtension.js';
// Define any additional plugins specific to this bundle
const additionalPlugins = [copy({ patterns: '**/cdm-locales/**/*', rootDir: './src' })];

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
        image(),
        graphql({ include: '**/*.gql' }),
        string({
            include: ['**/*.ejs', '**/*.graphql'],
        }),
        addJsExtensionToImportsPlugin({
            packages: '*',
            needToAddIndexJs: [],
            excludeImports: ['@emotion/react/jsx-runtime'],
        }),
        typescript(), // TypeScript at the top as per best practices
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
function watch(watchOptions, buildMode = '') {
    const filename = path.basename(watchOptions.input);
    message(
        'note',
        `${dt()} Rollup: Watcher Starting - watching for changes starting with: "${filename}" buildMode="${buildMode}"...`,
        'WATCH  ',
        true,
    );
    const watcher = rollup.watch(watchOptions);

    watcher.on('event', (event) => {
        // event.code can be one of:
        //   START        — the watcher is (re)starting
        //   BUNDLE_START — building an individual bundle
        //                  * event.input will be the input options object if present
        //                  * event.output contains an array of the "file" or
        //                    "dir" option values of the generated outputs
        //   BUNDLE_END   — finished building a bundle
        //                  * event.input will be the input options object if present
        //                  * event.output contains an array of the "file" or
        //                    "dir" option values of the generated outputs
        //                  * event.duration is the build duration in milliseconds
        //                  * event.result contains the bundle object that can be
        //                    used to generate additional outputs by calling
        //                    bundle.generate or bundle.write. This is especially
        //                    important when the watch.skipWrite option is used.
        //                  You should call "event.result.close()" once you are done
        //                  generating outputs, or if you do not generate outputs.
        //                  This will allow plugins to clean up resources via the
        //                  "closeBundle" hook.
        //   END          — finished building all bundles
        //   ERROR        — encountered an error while bundling
        //                  * event.error contains the error that was thrown
        //                  * event.result is null for build errors and contains the
        //                    bundle object for output generation errors. As with
        //                    "BUNDLE_END", you should call "event.result.close()" if
        //                    present once you are done.
        // If you return a Promise from your event handler, Rollup will wait until the
        // Promise is resolved before continuing.
        // console.log(`rollup: ${event.code}`)
        if (event.code === 'BUNDLE_END') {
            const outputFiles = event.output.map((o) => path.basename(o)).join(', .../');
            const msg = `${dt()} Rollup: wrote bundle${event.output.length > 1 ? 's' : ''}: ".../${outputFiles}"`;
            if (NOTIFY) {
                notifier.notify({
                    title: 'React Component Build',
                    message: msg,
                });
            }
            // messenger: success, warn, critical, note, log
            message('success', msg, 'SUCCESS', true);
        } else if (event.code === 'ERROR') {
            message('critical', `!!!!!!!!!!!!!!!\nRollup ${event.error}\n!!!!!!!!!!!!!!!\n`, 'ERROR', true);
            if (NOTIFY) {
                notifier.notify({
                    title: 'NotePlan Plugins Build',
                    message: `An error occurred during build process.\nSee console for more information`,
                });
            }
        }
    });

    // This will make sure that bundles are properly closed after each run
    watcher.on('event', ({ result }) => {
        if (result) {
            result.close();
        }
    });

    // Additionally, you can hook into the following. Again, return a Promise to
    // make Rollup wait at that stage:
    watcher.on('change', (id /* , { event } */) => {
        const filename = path.basename(id);
        message('info', `${dt()} Rollup: file: "${filename}" changed`, 'CHANGE', true);
        /* a file was modified */
    });
    watcher.on('restart', () => {
        // console.log(`rollup: restarting`)
        /* a new run was triggered (usually a watched file change) */
    });
    watcher.on('close', () => {
        console.log(`rollup: closing`);
        /* the watcher was closed, see below */
    });
    process.on('SIGINT', async function () {
        console.log('\n\n');
        console.log(colors.yellow('Quitting...\n'));
        if (watcher) {
            await watcher.close();
        }
        process.exit();
    });
}

export { createRollupConfig, baseConfig };
