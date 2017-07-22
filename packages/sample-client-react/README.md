# React Package
React components and containers

What does it include:
---
    1. exported react pure components
    2. exported react containers
    3. Typescript 2.0.0 => ES6
    4. unit testing with jest

Purpose:
---
This package can be installable in front-end webserver

Useful commands:
---
    npm run build       - build the library files
    npm run test        - run tests once
    npm run test:watch  - run tests in watchmode (Useful for development)
    
Files explained:
---
     src                         - directory is used for typescript code that is part of the project
        index.ts                 - Index file of the package. Consists of exported components and containers
        index.spec.ts            - Tests file for main
        components               - All pure components which don't depend on backend data or external state such as redux
            index.ts             - References all the exported components
        containers               - Components with data to render. Tightly coupled with redux. 
            index.ts             - References all the exported containers
     package.json                - file is used to describe the library and packages that are required added under peer-dependencies section
     tsconfig.json               - configuration file for the library compilation
     webpack.config.js           - configuration file of the compilation automation process for the library


Tutorials:
---
[react-jest-enzymes test](https://www.youtube.com/watch?v=bMmntkVM4wQ)

[testing react with enzyme tutorial](http://codeheaven.io/testing-react-components-with-enzyme/)

[react-redux-typescript-guide](https://github.com/piotrwitek/react-redux-typescript-guide)

Performance:
---
[Redux FAQ: Connecting multiple components](http://redux.js.org/docs/FAQ.html#react-multiple-components)

[React/Redux Links: Performance articles](https://github.com/markerikson/react-redux-links/blob/master/react-performance.md)

[React/Redux: Component re-rendering too often?](http://redux.js.org/docs/faq/ReactRedux.html#react-rendering-too-often)
                 