# Redux Package
Redux npm package includes actions, action-types and reducers

  1. [TypeScript and Redux: getting started][article-1]
  2. [TypeScript and Redux: async actions][article-3]
  3. [TypeScript and Redux: unit testing with Jest][article-4]
  4. [Integrating TypeScript and redux-thunk][article-5]


What does it include:
---
    1. exported reducers
    2. exported actions
    3. exported graphql queries
    4. Typescript 2.0.0 => ES6
    5. unit testing with jest

Purpose:
---
This package can be installable in front-end webserver to use the reducers and actions.

The goal is to make a isolated and reusable module that is self-contained. In order to avoid name conflicts, following rules need to be abide.
1. MUST export a function call reducer()
2. MUST export its action creators as functions
3. MUST have action types in the form `@npm-module-or-app/ACTION_TYPE` eg. `@@sample-stack/INCREMENT_COUNTER`
4. MUST have reducer in the form `npm-module-or-app/reducer_name` eg. `@sample-stack/counter`

What's not included
---
- It does not have any client UI components such as React
- It does not configure Redux Store

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
                 

[article-1]: https://rjzaworski.com/2016/08/getting-started-with-redux-and-typescript
[article-2]: https://rjzaworski.com/2016/08/typescript-redux-and-react
[article-3]: https://rjzaworski.com/2016/09/typescript-redux-async-actions
[article-4]: https://rjzaworski.com/2016/12/testing-typescript-with-jest
[article-5]: https://rjzaworski.com/2017/01/typescript-redux-thunk
