
What is lerna?
===
 It is a tool for managing JavaScript projects with multiple packages. More information can be found [here](https://github.com/lerna/lerna)


Things to know about current package structure
--
- We run `lerna` commands by wrapped into `npm` commands. 
- You will notice there are following commands which run's lerna comamnds.

```json
{
    ...
    "lerna:prepublish": "git checkout publish && git merge -s recursive -X theirs master",
    "lerna:prepublish:develop": "git checkout publish-develop && git merge -s recursive -X theirs develop",
    "watch": "lerna exec --no-sort --ignore *server --stream --parallel -- webpack --watch",
    "publish": "npm run lerna:prepublish && lerna publish",
    "lerna": "lerna bootstrap --hoist",
    "postinstall": "npm run lerna",
    "clean": "lerna clean",
    "build": "npm run build:packages",
    "build:packages": "lerna run build --ignore *server",
    "build:packages:watch": "lerna run build:lib:watch --ignore *server --stream",
    ...
}
```

Details on each command that wrapped for lerna
--
- `npm install` - This command need to be run in the root of the package only to install all the dependencies. We have post step(`postinstall`) to run `npm run lerna` after install finishes so `lerna` will installs all of packages (seen under packages directory) dependencies and links any cross-dependencies.
Note: We do not need to run `npm install` under any packages with `package.json` files seen under `packages` and `servers` directories. 
- `npm run lerna` - This triggers `lerna bootstrap --hoist`. Normally this get triggered as post install step. You can run this command to install any packages' dependencies. More information about this command can be found [here](https://github.com/lerna/lerna/blob/master/doc/hoist.md). The bottom line, the `hoist` will try to install all common dependencies to the top-level node_modules, and omitted from individual package node_modules.
The outlier packages with different versions will get a normal, local node_modules installation of the necessary dependencies.
- `npm run clean` - Removes the node_modules directory from all packages.
- `npm run build` - It invokes `npm run build` in each packages parallely. 
- `npm run watch` - Automatically builds the packages that are changed. Recommended to run this when actively coding, so you would know anything (compilation errors) breaks instantly.


Adding packages as dependencies to sibling packages
--
When you add sibling package to one of the packages, you need to run `npm run lerna` symlink the packages that are dependencies of each other.

