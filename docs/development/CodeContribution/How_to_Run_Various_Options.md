## SETUP and INSTALL
### To Install the project and build all packages

`yarn bootstrap`

### To clean install the project of already installed.

If you need to do a clean the existing node_modules and take latest changes from the remote head

`yarn clean:install`

## LINTING
### To check linting

`yarn lint <relative folder>`

### To check and auto fix linting

`yarn format <relative folder>`

## PACKAGES COMMANDS
### To run build all packages

`yarn build`

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

## TO START SERVERS
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

### To run both Frontend and Backend Server

`yarn start`

### To run both Frontend and Backend Server but start frontend in SSR Mode

`yarn start:envSSR`


### To run Frontend with production build in development

build the package

`lerna exec --scope=*frontend-server yarn build`

start the server with `dev` environment file

`lerna exec --scope=*frontend-server yarn start:dev`

Make sure backend is also running in seperate terminal

`lerna exec --scope=*backend-server yarn watch`



