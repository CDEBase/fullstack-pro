const pMap = require('p-map');
const Packages = require('@lerna/project');
const batchPackages = require('@lerna/batch-packages');

exports.findConfigs = findConfigs;

// Write out all the monorepo packages that are not libraries -- typically applications or metapackages
const ignored = new Set([
  // we don't reuse the servers as a library
  "server",
]);

async function findConfigs({
  cwd: startDir,
  // concurrency = os.cpus().length,
  // watch = !!process.env.ROLLUP_WATCH,
} = {}) {
  console.log('path', process.cwd());
  const lernaProject = new Packages(process.cwd());
  const lernaPackages = await Packages.getPackages(startDir);
  // const configs = await pMap(
  //   // clones internal JSON, maps synthetic location to cwd property
  //   flatBatched(lernaPackages).map(pkg => [pkg.toJSON(), pkg.location]),
  //   {}
  //   // ([pkg, cwd]) => generateConfig(pkg, { cwd, watch }),
  //   // { concurrency }
  // );

  // flatten then compact
  // return configs.reduce((acc, val) => acc.concat(val), []).filter(x => Boolean(x));

  // return lernaPackages.map(pkg => pkg.packageParentDirs);
  return lernaProject.packageParentDirs;
  // return flatBatched(lernaPackages);
}

/**
 * Will generate entry details for webpack as
 * reference: https://github.com/webpack/webpack/issues/1189#issuecomment-156576084
 *    entry: {
 *      'packages/sample-client-core/lib': './packages/sample-client-core/src/index.js', // will be  ./packages/sample-client-core/lib/index.js,
 *      'packages/sample-client-react/lib': './packages/sample-client-react/src/index.js'// will be  ./packages/sample-client-react/lib/index.js
 *     },
 *    output: {
 *       path: './',
 *       filename: '[name].js'
 *      }
 * @param {} pkg 
 * @param {*} opts 
 */
async function generateConfig(pkg, opts) {
  let config;

      // completely ignore packages that opt-out
      if (dotProp.has(pkg, 'rollup.skip')) {
        return null;
    }

    // allow per-package opt-out of watch
    if (opts.watch && dotProp.has(pkg, 'rollup.ignoreWatch')) {
        return null;
    }
    return 

}

function flatBatched(pkgList) {
  // ensures packages are built in topological order, dependencies before dependents
  const batches = batchPackages(pkgList);

  return batches.reduce((acc, batch) => acc.concat(batch), []);
}
