/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const workspaceUtils = require('./workspaces-utils');

function getWorkspacePackagePaths(root) {
    console.log('--_ROOT', root)
    console.log('--GET WORKSPACES', workspaceUtils.getWorkSpacePackages(root))
    return workspaceUtils.getWorkSpaceDirPaths(root).map((dir) => path.resolve(dir));
}

function isWorkspacePackageFile(filePath, workspacePackagePaths) {
    filePath = path.resolve(filePath);
    return workspacePackagePaths.some((packagePath) => filePath.startsWith(packagePath));
}

function createAliases(workspacePackagePaths, libAlias) {
    return workspacePackagePaths.reduce((result, packagePath) => {
        console.log('--packagePath', packagePath);
        const { name } = require(path.resolve(packagePath, 'package.json'));
        const useLib = libAlias && fs.existsSync(path.resolve(packagePath, libAlias));

        return {
            ...result,
            [name]: path.resolve(useLib ? `${packagePath}/${libAlias}` : packagePath),
        };
    }, {});
}

function overridePlugin(plugin, workspacePackagePaths, overrides) {
    const override = overrides[plugin.constructor.name];
    if (override) {
        return override(plugin, workspacePackagePaths);
    }
    return plugin;
}

module.exports = {
    getWorkspacePackagePaths,
    isWorkspacePackageFile,
    createAliases,
    overridePlugin,
};
