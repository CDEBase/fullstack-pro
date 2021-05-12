const { isWorkspacePackageFile } = require('./utils');

// plugin adjustments

module.exports = {
    // avoid duplicate hot handling against devServer.hot
    HotModuleReplacementPlugin: () => null,

    // allow watching files from "outside" (our workspace packages)
    WatchFilterPlugin: (plugin, workspacePackagePaths) => {
        const originalFilter = plugin.filter;
        const filter = (file) => isWorkspacePackageFile(file, workspacePackagePaths) || originalFilter(file);

        plugin.filter = filter;
        return plugin;
    },
};
