# Full Stack Packages

*Fullstack packages to develop and test end to end; to use as packages or work independently.*

## Note

This is still in work-in-progress.

The idea is to create modules for each package so it can work independently as well as integrated to another project as packages. 

It uses lerna.json for creating the packages structure. Under packages you can create different modules based on its usage. For example:

- sample-server - Where express or any server runs. This would be mainly used for testing the packages.
- sample-graphql-resolver - This is where you store the graphql schema and resolvers are stored. This will be used in sample-server to test. 
- sample-server-core - This is where the core interface of the package stays and core functionality
- sample-client-core - This is where core client components and redux binding stays. 
- sample-client-browser - This is used mainly to test the @sample-client-core component in the browser.
- client-common - This has the config files and boilerplate code for client and should not be modified.