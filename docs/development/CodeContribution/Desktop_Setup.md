
# Follow steps to [install project](./Project_Setup.md)

### Start Desktop application

Before to start desktop application, make sure to start the backend server of the web application first. 

`lerna exec --scope=*backend-server yarn watch`

And then start desktop application. 

`lerna exec --scope=*desktop yarn watch`
