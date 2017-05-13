# Full Stack Packages

*Fullstack packages to develop and test end to end; to use as packages or work independently.*

Purpose: 
---
    The idea is to create modules for each package so it can work independently as well as integrated to another project as packages. 

Useful commands:
---
    lerna clean             - removes the node_modules directory from all packages. [More details here.][lerna-clean]
    npm start               - Starts the web server and backend server
    npm run watch           - build the packages in watchmode (Useful for development)
    npm run lerna           - install external dependencies at the repo root so they're available to all packages.
    npm run build           - build all the packages
    npm install             - runs `lerna` and `build`
    lerna publish           - publishes packages in the current Lerna project. 

Files explained:
---    
It uses `lerna.json` for creating the packages structure. Under packages you can create different modules based on its usage. For example:

packages
 sample-apollo-server    - Where express or graphql server runs the server code.
     sample-graphql-resolver - This is where you store the graphql schema and resolvers. This will be used in `sample-apollo-server` to run. 
     sample-core             - This is where the core interface of the package stays and core functionality shared between client and server.
     sample-server-core      - This is where the core interface of the package stays and core functionality that only runs on server.
     sample-client-core      - This is where the core interface of the package stays and core functionality that only runs on client.
     sample-client-redux     - This is where the redux's reducer and actions are defined. Which uses `@sample\core` or `@sample\client-core`.
     sample-client-react     - This is where react pure components and containers are created. Which uses `@sample\client-redux`
     sample-browser-server   - This is useful to show demo of the `@sample\client-*` components and UI elements in the browser.


## Getting Started

If you want to develop FullStack locally you must follow the following instructions:

* Fork or Clone this repository

* Install the project in your computer

```
git clone https://github.com/cdmbase/fullstack-pro
cd fullstack-pro
npm install
```
to run server
you can run both the client and server together by 
```
npm start
```
The graphql server endpoints are
>http://localhost:3000/graphql

>http://localhost:3000/graphiql

The browser server endopoint is
>http://localhost:8080

If you want to run server independently
```
npm run start:server 
- or -
cd packages/sample-server
npm start
```
to run client server
```
npm run start:client
- or -
cd packages/sample-browser-server
npm start
```
to run build with watch. Useful for auto reloading changes into the server to be productive during development.
```
npm run watch
```



[lerna-clean]: https://github.com/lerna/lerna#clean