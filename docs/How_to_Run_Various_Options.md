


To run all packages in watch mode
---
`npm run watch`

To run a individual package in watch mode
---
`lerna exec --scope=<package name> npm run watch`

More details on how to use [lerna exec](https://github.com/lerna/lerna/tree/master/commands/exec#options)


To run any command on the packages

`lerna exec --scope=<package_name> <command>`


### How to Start Backend and Frontend seperately.

To start the frontend-server

`lerna exec --scope=*frontend-server npm run watch`

To just start the backend-server

`lerna exec --scope=*backend-server npm run watch`


To run in SSR Mode
---

`npm run start:envSSR`




