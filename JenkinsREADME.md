# Authorizing jenkins to access a repository 
#### 1- execute to the jenkins running pod and get the public ssh key
```
kubectl exec -it <pod_name> bash
cat /var/jenkins_home/.ssh/id_rsa.pub
```
#### 2- copy the key and go to the repository on github
- Go to Setting
- Deploy keys
- Add deploy key
#### 3- Go to jenkins 
- Create a new item
- Choose pipeline
- Provide the repo name
- go to pipeline 
- Choose pipeline script from SCM
- Choose git
- Give the repo URL and choose credentail 
- Choose the Username from credentials list
#### If the credential (ssh public key) is used for the first time: 
- choose Add Credentials
- Choose SSH Username with private key
- From the Jenkins master ~/.ssh
- Give the key a username and choose this user name later on on the list

# Authorizing jenkins to Google Container Registery
#### 1- in google cloud console 
  - Go to APIs and services 
  - Credentials
  - create credential 
  - service account key 
  - New Service account
  - Add role Storage Admin
  - generate key of type JSON
> Copy the generated key to jenkins pod and user the 
> key path to login to gcr with docker login command
