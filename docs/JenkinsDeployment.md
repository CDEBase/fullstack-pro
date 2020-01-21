

# Jenkins Deployment

The branches used for Jenkins deployment will be `devpublish` for testing `develop` branch. This is used for pre production testing. 

`publish` branch is used for testing `master` branch. This is also used for production deployment.

- Modifying JenkinsFile

All modification in `Jenkinsfile` should be done in `develop` branch. As these changes need to be merged to `devpublish` for jenkins to use, you can run following command.

```
npm run devpublish:push
```

