# Authorizing jenkins to access a repository
#### 1- execute to the jenkins running pod and get the publish ssh key
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
- Give the repo URL and choose credential
- Choose the Username from credential list
#### If the credential (ssh public key) is used for the first time:
- choose Add Credentials
- Choose SSH Username with private key
- From the Jenkins master ~/.ssh
- Give the key a username and choose this user name later on on the list

# Authorizing jenkins to Google Container Registry
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

# Adding deploy key to jenkins and github repo
#### 1- execute to the jenkins running pod and get the public ssh key
```
kubectl exec -it <pod_name> bash
mkdir repo-name
ssh-keygen 
```
> generate the ssh key in the created directory
#### 2- Login to jenkins 
  - Go to Credentials 
  - System
  - Global credentials
  - Add Credentials
#### 3- Choose from the drop down list SSH Username with private key and edit the following 
- Add Username (that would be the credential name make it descriptive like the repo name)
- In the Private key section choose From a file on Jenkins master and add the path to the private key on jenkins (If you followed the above instruction it would be /repo-name/id_rsa)
- Ok to save the key in credentials 
#### 4- create a new pipeline in jenkins
#### 5- in the pipeline section choose Pipeline script from SCM
#### 6- Choose git as SCM 
#### 7- add the repo (ssh clone link)
#### 8- in credentials section choose the key you just created
    
