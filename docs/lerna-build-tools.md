
What is lerna?
===
[Lerna](https://github.com/lerna/lerna) allows us to manage multiple packages inside the same repository instead of creating one repository per package. With Lerna, we can unify processes like linting, building, testing, and releasing, have a single place to report issues, and becomes easier to set up our development environment.


Things to know about current package structure
--
- We run `lerna` commands by wrapped into `npm/yarn` commands. 
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
    "watch-packages": "lerna exec --no-sort  --scope @sample-stack/platform* --scope @sample-stack/react-shared-components --scope @sample-stack/core --stream --parallel 'webpack --watch'",
    ...
}
```

Details on each command that wrapped for lerna
--
- `npm install` - This command need to be run in the root of the package only to install all the dependencies. We have post step(`postinstall`) to run `npm run lerna` after install finishes so `lerna` will installs all of packages (seen under packages directory) dependencies and links any cross-dependencies.
Note: We do not need to run `yarn` under any packages with `package.json` files seen under `packages` and `servers` directories. 
- `yarn lerna` - This triggers `lerna bootstrap --hoist`. Normally this get triggered as post install step. You can run this command to install any packages' dependencies. More information about this command can be found [here](https://github.com/lerna/lerna/blob/master/doc/hoist.md). The bottom line, the `hoist` will try to install all common dependencies to the top-level node_modules, and omitted from individual package's `node_modules`.
The outlier packages with different versions will get a normal, local node_modules installation of the necessary dependencies.
- `yarn clean` - Removes the `node_modules` directory from all packages.
- `yarn clean:force` - Removes the `node_modules` directory from all packages as well as `package-lock.json` file.
- `yarn build` - It invokes `npm run build` in each packages parallely. 
- `yarn watch` - Automatically builds the packages that are changed. Recommended to run this when actively coding, so you would know anything (compilation errors) breaks instantly. You may also see `Error: ENOSPC: System limit for number of file watchers reached` if you OS is not configured with high open files. Check [Not Enough Watchers](#not-enough-watchers) section for futher information.
- `yarn watch-packages` - Abutomatically builds the dependent packages mostly under `packages` folder. 
- `yarn watch-packages -- --scope @sample-stack/counter-module-*` - By adding package module you like to watch along with the dependent packages. If you have more packages to watch keep adding with `-- --scope packageA* --scope packageB`



Not Enough Watchers
----
Based on the project, we may have multiple `packages` and `packages-modules` to watch for file changes in order to automatically apply the changes in the browser. 
When we have more modules to watch, we need laptop resource to support it. If the laptop OS is configured with default `open files`, we need to increase it. 
Follow notes from webpack to change OS configuration to increase file watchers https://webpack.js.org/configuration/watch/#not-enough-watchers

But, in case, if you are working in only one or two modules and need to watch them only then you can run below command on each packages, 
respectively. 

`lerna exec --scope=<package name> yarn watch`

example: run them in different command tabs for all (package1, package2, pacakge3) packages to watch.

```
lerna exec --scope=@sample-stack/counter-module-browser yarn watch
lerna exec --scope=@sample-stack/counter-module-server yarn watch
```

Adding packages as dependencies to sibling packages (not needed anymore)
--
When you add sibling package to one of the packages, you need to run `npm run lerna` symlink the packages that are dependencies of each other.


### List packages

Using the following folder structure, versions, and privacy as an example:

```bash
fullstack-pro/
├── packages
│   ├── sample-core         # 1.1.1 - public
│   ├── sample-platform    
│   │   ├── browser         # 1.1.1 - public
│   │   └── server          # 1.1.1 - public
│   ...
├── packages-modules
│   └── counter 
│   │   ├── browser     
│   │   └── server
├── servers
│   ├── backend-server      # 1.0.0 - private
│   ├── frontend-server     # 1.0.0 - private
│   ...
|── package.json
└── lerna.json              # 1.1.1
```

List all public packages

```bash
lerna ls

# result
@sample-stack/counter-module-browser
@sample-stack/counter-module-server
@sample-stack/core
@sample-stack/platform-browser
@sample-stack/platform-server
@sample-stack/store
```

List all packages (public and private)

```bash
lerna ls --all

# result
@sample-stack/counter-module-browser
@sample-stack/counter-module-server
@sample-stack/core
@sample-stack/platform-browser
@sample-stack/platform-server
@sample-stack/store
sample-stack-desktop                 (PRIVATE)
sample-stack-mobile                  (PRIVATE)
sample-stack-backend-server          (PRIVATE)
sample-stack-frontend-server         (PRIVATE)
sample-stack-moleculer-server        (PRIVATE)
```

List all public packages with more details

```bash
lerna ll
# or
lerna ls -l

# result
@sample-stack/counter-module-browser v0.0.1 packages-modules/counter/browser
@sample-stack/counter-module-server  v0.0.1 packages-modules/counter/server
@sample-stack/core                   v0.0.1 packages/sample-core
@sample-stack/platform-browser       v0.0.1 packages/sample-platform/browser
@sample-stack/platform-server        v0.0.1 packages/sample-platform/server
@sample-stack/store                  v0.0.1 packages/sample-store
```

List all public and private packages with details

```bash
lerna la
# or
lerna ls -la

# result
@sample-stack/counter-module-browser v0.0.1 packages-modules/counter/browser
@sample-stack/counter-module-server  v0.0.1 packages-modules/counter/server
@sample-stack/core                   v0.0.1 packages/sample-core
@sample-stack/platform-browser       v0.0.1 packages/sample-platform/browser
@sample-stack/platform-server        v0.0.1 packages/sample-platform/server
@sample-stack/store                  v0.0.1 packages/sample-store
sample-stack-desktop                 v0.0.1 portable-devices/desktop         (PRIVATE)
sample-stack-mobile                  v0.0.1 portable-devices/mobile          (PRIVATE)
sample-stack-backend-server          v0.0.1 servers/backend-server           (PRIVATE)
sample-stack-frontend-server         v0.0.1 servers/frontend-server          (PRIVATE)
sample-stack-moleculer-server        v0.0.1 servers/moleculer-server         (PRIVATE)
```

## Packages vs Scoped Packages

All npm packages have a name. Some also have a scope. Scopes are a way of grouping related packages together.

When we sign up for an npm user account or create an organization, we can use a scope that matches our user or organization name. The same happens for Github Packages Registry. In both registries, my username is **sample-stack**, so my scope is also **sample-stack**.

Using packages without a scope, we can easily have naming conflicts with other person packages. For example, we can not create a package named jquery on npm because it already exists.

When we use scoped packages, naming is not a problem because we are naming packages inside our scope.

If I were creating a new scoped package called **core**, its name in the **package.json** file would be **@sample-stack/core**.

## Dependencies
The dependencies of our projects are registered inside the **package.json** file. This file is usually in the project's root folder, but it is also inside each package in the Lerna projects. **Each package has its dependencies.**

```bash
fullstack-pro/
├── packages
│   ├── sample-core
│   │   ├── package.json
│   │   └── ...
│   ├── sample-platform
│   │   ├── browser
│   │   │   ├── package.json
│   │   │   └── ...
│   │   └── server
│   │   │   ├── package.json
│   │   │   └── ...
│   ...
├── packages-modules
│   └── counter
│   │   ├── browser
│   │   │   ├── package.json
│   │   │   └── ...
│   │   └── server
│   │   │   ├── package.json
│   │   │   └── ...
├── servers
│   ├── backend-server
│   │   ├── package.json
│   │   └── ...
│   ├── frontend-server
│   │   ├── package.json
│   │   └── ...
│   ...
|── package.json
└── lerna.json
```
To add dependencies to the packages, Lerna provides us the command `lerna add`. Note that only a single package can be added at a time compared to `yarn add` or `npm install`.

### Add dependencies

The **dependencies** key must contain all the dependencies our project/application/package/library needs to work in production. **We know when we must declare it as a dependency when its absence has side effects on your production build.**

**Adding dependencies**

```bash
# add a dependency to one package
lerna add lodash --scope=@sample-stack/counter-module-browser

# add a dependency to several packages
lerna add lodash packages-modules/counter-*

# add a dependency to all packages
lerna add lodash

# add a dependency on the root package.json
lerna add lodash -w
```

### Add devDependencies

The **devDependencies** key must contain all the **dependencies we use during development or needed during the build of our production bundle**. To add a dependency as devDependency just add the flag `--dev`.

```bash
# add a devDependency to one package
lerna add lodash --scope=@sample-stack/counter-module-browser --dev

# add a devDependency to several packages
lerna add lodash packages-modules/counter-* --dev

# add a devDependency to all packages
lerna add lodash  --dev

# add a devDependency on the root package.json
lerna add lodash -w  --dev
```

### Add peerDependencies

The  **peerDependencies** key is **used when our package has a dependency that can also be a dependency of the project using it**. If our package has a dependency that can also be used by its dependent, we can specify the version required by us and the dependent will receive a warning when not matching that requirement.

```bash
# add a peerDependency to one package
lerna add lodash --scope=@sample-stack/counter-module-browser --peer

# add a peerDependency to several packages
lerna add lodash packages-modules/counter-*  --peer

# add a peerDependency to all packages
lerna add lodash  --peer
```

### Updating dependencies

Well, that is a problem. Lerna has no direct command to upgrade dependencies, which is ok when we want to update a dependency in the root package.json. We can use yarn as usually:

```bash
# update a dependency on the root package.json
yarn upgrade lodash
```

However, when we want to  upgrade a dependency inside a package, nothing seems to work. Using `lerna exec` as we use it to remove dependencies does not work.

For now, what we do is manually update the dependencies version in the `package.json` file of each package and then run `yarn install`.


### Updating all sub packages of a **scoped** packages to newest release
lerna exec "ncu -u --newest --timeout 60000 -f /@sample-stack*/"


### Removing dependencies

Lerna also has no direct way to allow us to remove dependencies from the project or packages but we can use the `lerna exec` and `yarn remove` commands to go around it.

`lerna exec` allow us to run a specific command within a particular package, several packages (using a glob expression), or in all of them. Using it with `yarn remove` we can remove dependencies from the packages. Using `yarn remove` alone we can also remove dependencies from the root package.json.

```bash
# remove a dependency to one package
lerna exec --scope @sample-stack/counter-module-browser -- yarn remove lodash

# remove a dependency to several packages
lerna exec --scope @sample-stack/counter-* -- yarn remove lodash

# remove a dependency to all packages
lerna exec -- yarn remove lodash

# remove a dependency from the root package.json
yarn remove lodash
```

### List modified packages

Like the `git status` command that shows us the files that we modified, Lerna provides us the command `lerna changed` that shows us the packages (not the files) that we modified compared to the remote repository.

```bash
lerna changed
```

### Diffing

**All modifications**

Like the `git diff` command but ignoring the files outside the packages, Lerna provides us the command `lerna diff` that shows us all the code modifications we did. We can also provide a package name to see only the modifications to that package.

```bash
# all modifications
lerna diff

# modifications in a specific package
lerna diff @sample-stack/counter-module-browser
```
## Publish

To publish our packages using Lerna we use the command `lerna publish` but, first, let's configure Lerna only to allow us to create newer versions of our packages from our main branch (eg. master).

```json[lerna.json]
{
  "version": "0.0.0",
  "command": {
    "version": {
      "allowBranch": "master"
    }
  }
}
```

Now, if we try to run `lerna publish` inside another branch, it will fail. As highlighted in the [Lerna documentation](https://github.com/lerna/lerna/tree/main/commands/version#--allow-branch-glob), this is a best practice that can save us some problems.

To publish a **scoped package** we also need to set the `publishConfig.access` to `true` in its **package.json**:

```json[packages/sample-core/package.json]
{
  "name": "@sample-stack/core",
  "version": "0.0.0",
  "publishConfig": {
    "access": "public"
  }
}
```
Setting this configuration in a package without a scope fails to publish.

Imagine that we started developing the **sample-core** package, and although we merged some initial versions, we didn't finish yet, and **we don't want to release it to npm yet**. We can add to its **package.json** the **private** key with the value `true`, and Lerna will ignore it.

```json[packages/sample-core/package.json]
{
  "name": "app-button",
  "version": "0.0.0",
  "private": true
}
```

### npm

To publish to npm, first, we need to have an npm account.

We can see if we are logged in running:

```bash
npm whoami
```

In case we are not, we do it running:

```bash
npm login
```

Once we are logged in we can run:

```bash
lerna publish
```

Which prompts possible versions to update each package. It's up to us to select the right ones based on what we have done. Check the [Semantic Versioning Specification](https://semver.org/) for more information about versioning.

### Github Package Registry

To publish in the Github Packages Registry, we need some extra configurations.

First, in the **package.json** of each package, we must specify the repository where our code lives.

```json[package.json]
{
  ...
  "repository" : {
    "type" : "git",
    "url": "ssh://git@github.com:cdmbase/fullstack-pro.git"
  }
}
```

Then, in the **lerna.json** file, we must specify the registry to publish the packages. By default, it is the npm registry. We have to change it to the `https://npm.pkg.github.com`.

```json[lerna.json]
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0",
  "command": {
    "version": {
      "allowBranch": "master"
    },
    "publish": {
      "registry": "https://npm.pkg.github.com"
    }
  }
}
```

We also have to create a personal token on GitHub with the permissions to read and write packages (`read:packages` and `write:packages`).

Using the generated token as a password, we authenticate on GitHub Package Registry:

```bash
$ npm login --registry=https://npm.pkg.github.com
> Username: USERNAME
> Password: TOKEN
> Email: PUBLIC EMAIL ADDRESS
```

And we are ready to publish packages:

```bash
lerna publish
```

## Conventional Commits

Lerna allows us to use the [Conventional Commits Specification](https://www.conventionalcommits.org/) to determine the bump version and generate the CHANGELOG.md files automatically.

Follow the specification, when we are creating a new release, Lerna checks all the commits since the last release and it increments:
- the PATCH number when the subject of the commit is prefixed with `fix:`;
- the MINOR number when the subject of the commit is prefixed with `feat:`. It has precedence over the PATCH;
- the MAJOR number when in the body of some commit it finds a string `BREAKING CHANGE:`. It can have any type provided in the subject and it has precedence over PATCH and MINOR. 

Considering that we are using fixed versions and our project is in the version `1.0.0`. If we try to create a new release with the following commit, our project version is updated to `1.0.1`.
```bash
# commit 1
subject -> "fix: fix button font size"
```

Then, if we do two more commits and publish again, the version is updated to `1.1.0`.
```bash
# commit 1
subject -> "fix: fix button border-radius"
# commit 2
subject -> "feat: added loading status to the button"
```

Finally, if we do three more commits, the version is updated to `2.0.0`.
```bash
# commit 1
subject -> "fix: fix button text color"
# commit 2
subject -> "feat: added outlined style"
# commit 3
subject -> "feat: changed the loading property to isLoading"
body: "BREAKING CHANGE: loading prop must be updated to isLoading"
```

### Configuration

To do that, we update our `lerna.json` file:

```bash
{
  ...
  "command": {
    "publish": {
       "conventionalCommits": true, 
       "yes": true
    }
  }
}
```

Now, when we run `lerna publish` instead of asking us what version we want to give to each package, it automatically determines and publishes those versions.