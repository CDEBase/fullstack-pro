
How to contribute as a developer?
--

1. Once you setup the project, switch to `develop` branch. 
2. Create a new branch using `develop` branch as source based on the issue you working. 
3. Update changes to that branch and create a PR agains `develop` branch. 
4. As soon as PR is created, we have a build process that runs in the background to check whether it is successful or failed.
5. If it successfull you will see a green check otherwise a red cross. When you notice it has red cross then run `npm run build` locally and fix any issues and submit the commit again to check it's updated status.



Note: `master` branch is read-only branch and we don't want to merge anything to it other than that from `develop` branch. So please avoid creating PRs agains master branch. 

