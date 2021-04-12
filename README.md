# Full Stack Packages

*Fullstack packages to develop and test end to end; to use as packages or work independently.*

Purpose: 
---
The idea is to create modules for each package so it can work independently as well as integrated to another project as packages. 

## Screenshot
![screencast](./ScreenShot.png)


Useful commands:
---
|command|Description|
|--------------------------|-----------|    
|`lerna clean`|                 - removes the node_modules directory from all packages. |
|`npm start`|       - starts the web server and backend server. Or Use `yarn zen:watch`|
|`yarn zen:watch`|         - starts the web server and backend server in watch mode.|
|`yarn zen:watch:debug`|    - starts the web server and backend server in debug and watch mode.|
|`yarn watch`|               - build the packages in watchmode (Useful for development)|
|`yarn lerna`|               - install external dependencies at the repo root so they're |`lable to all packages.|
|`yarn build`|               - build all the packages|
|`yarn install`|                - runs `lerna` and `build`|
|`lerna publish`|               - publishes packages in the current Lerna project. |

Files explained:
---    
It uses `lerna.json` for creating the packages structure. Under packages you can create different modules based on its usage. For example:

     packages                    - Has the packages to organize the codebase into multi-package repositories.
         sample-core             - Core interfaces of the packages which can be shared between server and client.
         sample-platform/server      - Core platform interfaces and its implementation code for Server.   
         sample-platform/browser     - Core platform browser State related code which consists of Redux, Graphql Gql and UI Components.
         sample-platform/react-shared-components     - React pure components and containers are defined. 
     packages-modules            - Has the server and browser side packages designed for a specific module feature.
     servers                     - Has the servers to organize the codebase into multi-package repositories.
         frontend-server         - Frontend Client Server. This is useful to show demo of this package.
         backend-server          - Backend apollo server. 
    

## [Project Setup](docs/Project_Setup.md)

In Order to get started with the development you need to go through the 
documentation first

- [Getting Started with lerna](./docs/lerna-build-tools.md)
- [Running the servers](./docs/How_to_Run_Various_Options.md)
- [Dos and Dont](./docs/DoAndDont.md)

