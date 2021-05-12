const {
    getWorkSpacePathTo,
    getPathsInWorkspace,
    getWorkspaceAbsPaths,
    getWorkspaceDirNames,
    getWorkspaces,
} = require('./workspaces-paths');

const { getWorkSpaceDirPaths, getWorkSpacePackages } = require('./workspaces-packages');

module.exports = {
    getWorkSpacePathTo,
    getPathsInWorkspace,
    getWorkspaceAbsPaths,
    getWorkspaces,
    getWorkSpaceDirPaths,
    getWorkspaceDirNames,
    getWorkSpacePackages,
};
