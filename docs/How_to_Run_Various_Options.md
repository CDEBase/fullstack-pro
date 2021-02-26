


### To run all packages in watch mode

`yarn watch`

Note: It only run `packages` and `packages-modules` only in watch mode. Servers should be run seperately.

Also check out `yarn watch-packages` to run watch on required packages. 


### To run build with watch for dependent packages

For auto reloading changes into the server to be productive during development.

```
yarn watch-packages
```

If you also need to watch along with it, you can as many scopes as required like below. 

```
yarn watch-packages -- --scope=@sample-stack/counter-module* --scope=@packageb
```


### To run a individual package in watch mode

`lerna exec --scope=<package name> yarn watch`

More details on how to use [lerna exec](https://github.com/lerna/lerna/tree/master/commands/exec#options)


To run any command on a package <package_name>

`lerna exec --scope=<package_name> <command>`


### How to Start Backend and Frontend seperately.

To start the frontend-server

`lerna exec --scope=*frontend-server yarn watch`

To just start the backend-server

`lerna exec --scope=*backend-server yarn watch`


### To run Frontend Server in SSR Mode

`yarn start:envSSR`


### To run Frontend with production build in development

build the package

`lerna exec --scope=*frontend-server yarn build`

start the server with `dev` environment file

`lerna exec --scope=*frontend-server yarn start:dev`

Make sure backend is also running in seperate terminal

`lerna exec --scope=*backend-server yarn watch`



