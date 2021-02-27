


### To run all packages in watch mode

`npm run watch`

Note: It only run `packages` and `packages-modules` only in watch mode. Servers should be run seperately.

Also check out `npm run watch-packages` to run watch on required packages. 


### To run build with watch for dependent packages

For auto reloading changes into the server to be productive during development.

```
npm run watch-packages
```

If you also need to watch along with it, you can as many scopes as required like below. 

```
npm run watch-packages -- --scope=@sample-stack/counter-module* --scope=@packageb
```


### To run a individual package in watch mode

`lerna exec --scope=<package name> npm run watch`

More details on how to use [lerna exec](https://github.com/lerna/lerna/tree/master/commands/exec#options)


To run any command on a package <package_name>

`lerna exec --scope=<package_name> <command>`


### How to Start Backend and Frontend seperately.

To start the frontend-server

`lerna exec --scope=*frontend-server npm run watch`

To just start the backend-server

`lerna exec --scope=*backend-server npm run watch`


### To run Frontend Server in SSR Mode

`npm run start:envSSR`


### To run Frontend with production build in development

build the package

`lerna exec --scope=*frontend-server npm run build`

start the server with `dev` environment file

`lerna exec --scope=*frontend-server npm run start:dev`

Make sure backend is also running in seperate terminal

`lerna exec --scope=*backend-server npm run watch`



