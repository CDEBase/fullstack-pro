# @sample-stack/graphql-schema
This package is intended to be used with [Apollo Server](http://docs.apollostack.com/apollo-server/tools.html) to provide an easy way to setup a GraphQL server and connect it to your database. Note that Apollo Server is not a depenedency of this package. 

Usage
---

Sample Schema exports four things: **database**, **resolvers**, **subscriptions** and **typeDefs**.


*resolvers*
Resolvers are functions that tell the server how to find and return the data for each field in a GraphQL query. The resolving functions simply call your Database Connectors by passing in parameters and return the Connectors result (usually a Promise).

After creating your Database and Connectors from Database, you can call the resolvers function by passing in the Connectors and your public application settings (since settings are stored in the application state). Building on the previous examples:

*typeDefs* is a GraphQL Schema based on the queries provided to it from database. With the schema, you can do things like Find Posts by post_type, get the Postmeta of a Post by the post_id, and so on.

*subscriptions* 
GraphQL subscriptions allow developers to introduce new levels of interactivity to their apps with near-realtime updates. You can keep your app updated to the latest changes (that you subscribe to) between different users:

*database*
The first part of Sample Schema is **database**. This class provides an easy connection to your database using some connection settings, explained below.


Files explained:
---
     src                         - directory is used for typescript code that is part of the project
        index.ts                 - Index file of the package. Consists of exported components and containers
        index.spec.ts            - Tests file for main
        modules                  - Fractal route for server-side application module splitting (schema definition, resolvers, subscription filters, database connectors )
     package.json                - file is used to describe the library and packages that are required added under peer-dependencies section
     tsconfig.json               - configuration file for the library compilation
     webpack.config.js           - configuration file of the compilation automation process for the library


Setup
---
`modules` directory consists of the sub directories based on the criteria for module splitting. Each sub-directory may have schema definition, resolvers, subscriptions, database

Schema definition files should have suffix as `.graphql` or `.graphqls`. Resolvers file should be named as `resolvers.ts` and subscriptions filter file as `subscriptions.ts`.

All the files under modules are automatically bundled when you run `npm run build`, so the above naming convention should be followed.

## Reference:
https://github.com/ramsaylanier/WordExpressSchema