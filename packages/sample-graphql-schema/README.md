# @schema/schema
This package is intended to be used with [Apollo Server](http://docs.apollostack.com/apollo-server/tools.html) to provide an easy way to setup a GraphQL server and connect it to your database. Note that Apollo Server is not a depenedency of this package. 

##Usage

Sample Schema exports three things: **database**, **resolvers**, and **typeDefs**.


*resolvers*
Resolvers are functions that tell the server how to find and return the data for each field in a GraphQL query. The resolving functions simply call your Database Connectors by passing in parameters and return the Connectors result (usually a Promise).

After creating your Database and Connectors from Database, you can call the resolvers function by passing in the Connectors and your public application settings (since settings are stored in the application state). Building on the previous examples:

*typeDefs* is a GraphQL Schema based on the queries provided to it from database. With the schema, you can do things like Find Posts by post_type, get the Postmeta of a Post by the post_id, and so on.

*database*
The first part of Sample Schema is **database**. This class provides an easy connection to your database using some connection settings, explained below.

## Reference:
https://github.com/ramsaylanier/WordExpressSchema