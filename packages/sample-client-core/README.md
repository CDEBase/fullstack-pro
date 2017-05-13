# Client Core Package
Helper methods and interfaces that can be used by the client part of the packages 

What does it include:
---
    1. exported reducers
    2. exported actions
    3. exported graphql queries
    4. Typescript 2.0.0 => ES6
    5. unit testing with jest

Purpose:
---
    This package can be installable in front-end webserver

What's not included
---
    It does not have any client UI components such as React
    It does have configured Redux Store

Useful commands:
---
    npm run build       - build the library files
    npm run test        - run tests once
    npm run test:watch  - run tests in watchmode (Useful for development)
    
Files explained:
---
     src                         - directory is used for typescript code that is part of the project
        index.ts                 - Index file of the package. Consists of exported reducers and actions
        index.spec.ts            - Tests file for main
        actions                  - Contains Actions to transform the state tree
            index.ts             - References all the exported actions
        reducers                 - Contains reducers, pure function with (state, action) => state signature. 
            index.ts             - References all the exported reducers.
     package.json                - file is used to describe the library and packages that are required added under peer-dependencies section
     tsconfig.json               - configuration file for the library compilation
     webpack.config.js           - configuration file of the compilation automation process for the library
                 