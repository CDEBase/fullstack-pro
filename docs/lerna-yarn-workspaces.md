## Introduction

[Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) allow us to run `yarn install` only once, although we have several packages. Yarn uses a single lock file rather than a different one for each project, which means fewer conflicts. Once all the dependencies are installed together, Yarn can better optimize them. Its most important feature is that when we have one package depending on another package of our repository, yarn link them together, allowing us to use always the most up-to-date code available.


## Yarn & Yarn Workspaces

### Set up yarn

To configure Lerna to use yarn under the hood, we need to go to the **lerna.json** file and add the **npmClient** key with the value `yarn`. Its value is `npm` by default.

```json[lerna.json]
{
  "packages": [
    "packages/*",
  ],
  "version": "0.0.0",
  "npmClient": "yarn"
}
```

### Set up yarn workspaces

To configure Lerna to use Yarn Workspaces, first, we need to [Set up yarn](#set-up-yarn). Then we have to configure it in the **lerna.json** and **package.json** files.

To do so, let's use the following folder structure as an example:

```bash
fullstack-pro
├── packages
│   ├── sample-core/
│   ├── sample-platform/
│   │   ├── browser
│   │   └── server/
│   ...
├── portable-devices
│   └── desktop
│   └── mobile
├── packages-modules
│   └── counter
│   │   ├── browser/
│   │   └── server/
├── servers
│   ├── backend-server/
│   ├── frontend-server/
│   ...
|── package.json
└── lerna.json
```

In the **package.json** file, we add the **workspaces** key with a list of globs that indicates the folders where we want to store our packages.

```json[package.json]
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages": [
      "portable-devices/*",
      "packages-modules/**",
      "packages/**",
      "servers/*"
    ]
  ],
  "devDependencies": {
    "lerna": "^3.22.1"
  }
}
```

In the **lerna.json** file, we can remove the **packages** key because the  **workspaces** key in the **package.json** file overrides it. We also need to add the **useWorkspaces** key with the value `true`.

```json[lerna.json]
{
  "version": "0.0.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

### Lerna
- [Getting Started with lerna](./lerna-build-tools.md)