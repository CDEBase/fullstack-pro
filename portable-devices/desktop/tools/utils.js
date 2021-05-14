const path = require('path');
const getSymlinkedNodeModulesForDirectory = require('../../../tools/get-symlinked-modules');

function getWorkspacePackagePaths(root) {
    const symlinkedModules = getSymlinkedNodeModulesForDirectory(root);
    const symlinkedModulePaths = Object.values(symlinkedModules);
    return symlinkedModulePaths.map((f) => path.resolve(f, 'lib'));
}
module.exports = {
    getWorkspacePackagePaths,
};
