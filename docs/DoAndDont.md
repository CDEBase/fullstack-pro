


Don't do it...
---
1. `npm install <package>`

    Do not install dependencies as `npm install <package dependency>`.
    We use `lerna` and the way it work for the project is by installing `dependencies` to the `packages` or `servers` that requires. In most cases,
    you can just add the package to frontend or backend by running following

    > to add to the frontend server so browser gets it

   `lerna add --scope=*fronted-server <package>`


    > to add to the backend server for nodejs to use it

   `lerna add --scope=*backend-server <package>`

   Ideally, root `package.json` should have all the `devDependencies` of the project and `packages` and `servers` file references under `dependencies`.

   Sometimes we may need to `pin` a package as other dependencies can bring some older versions of the package we want to add. In that case we can pin the required package version by adding to the `pacakge.json`. But make sure you don't have different version of the package in `servers` or `packages` otherwise a duplciate package will be added to its `nodemodules`.

Do
---
1. Each package version should be uniform across the repository

    Before adding a `<package dependency>`, see if the package of different version exist. If it exist then update that version to the required version.

2. You can edit one of the `packages` or `servers`'s `package.json` file directly to add a `dependencies` and then run `npm run lerna` to install them. This is a easy way to install a known version by adding to the target `pacakage.json` file.