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


## Development

If you want to develop gitstack locally you must follow the following instructions:

* Fork or Clone this repository

* Install the project in your computer

```
git clone https://github.com/cdmbase/fullstack-pro
cd fullstack-pro
npm install
npm run install
```
to run server
```
cd packages/sample-server
npm start
```
to run client server
```
cd packages/sample-browser-server
npm start
```
to run build with watch. Go to main directory and run
```
npm run build:packages:watch
```
