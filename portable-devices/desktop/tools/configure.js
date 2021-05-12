const merge = require('webpack-merge');

const utils = require('./utils');
const plugins = require('./plugins');

/**
 * Applies modifications to the given config.
 * @param {object} config - a electron-webpack webpack configuration object
 * @param {string} root - absolute path to the workspaces root folder
 * @param {string} [libAlias] - name of a package subfolder that the alias should point to
 */
module.exports = function configureYarnWorkspaces(config, root, libAlias) {
    const workspacePackages = utils.getWorkspacePackagePaths(root);
    console.log('---workspacePackages', workspacePackages);
    config = merge(config, {
        resolve: { alias: utils.createAliases(workspacePackages, libAlias) },
    });

    config.plugins = config.plugins
        .map((plugin) => utils.overridePlugin(plugin, workspacePackages, plugins))
        .filter(Boolean);

    return config;
};
