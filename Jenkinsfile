pipeline {
  agent any
  
  environment {
    FRONTEND_PACKAGE_NAME = getName("/var/jenkins_home/workspace/fullstack-pro/servers/frontend-server/package.json")
    FRONTEND_PACKAGE_VERSION = getVersion("/var/jenkins_home/workspace/fullstack-pro/servers/frontend-server/package.json")
    BACKEND_PACKAGE_NAME = getName("/var/jenkins_home/workspace/fullstack-pro/servers/backend-server/package.json")                                       
    BACKEND_PACKAGE_VERSION = getVersion("/var/jenkins_home/workspace/fullstack-pro/servers/backend-server/package.json")
  }
  
  stages {
    stage ('frontend server'){
      steps{
        sh 'docker login -u _json_key -p "$(cat /key.json)" https://gcr.io'
        sh """
          cd servers/frontend-server/
          npm run build && docker build . -t gcr.io/stack-test-186501//$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION 
          docker push gcr.io/stack-test-186501/$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
          docker rmi gcr.io/stack-test-186501//$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
        """
      }
    }

    stage ('backend server'){
      steps{
        sh 'docker login -u _json_key -p "$(cat /key.json)" https://gcr.io'
        sh """
          cd servers/backend-server/
          npm run build && docker build . -t gcr.io/stack-test-186501/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION 
          docker push gcr.io/stack-test-186501/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
          docker rmi gcr.io/stack-test-186501/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
        """
      }
    }
  }
  /*
post {
        success{
          build job: 'kube-orchestration', parameters: [string(name: 'TAG', value: "${PACKAGE_VERSION}")]
            //build 'kube-orchestration'
        }
}
*/
}

import groovy.json.JsonSlurper
/*
def getJSON(json_file_path){
  //def inputFile = new File("/var/jenkins_home/workspace/fullstack-pro/package.json")
  def inputFile = new File(json_file_path)
  def InputJSON = new JsonSlurper().parse(inputFile)
  def version = InputJSON.version 
  def name = InputJSON.name
  def jsonReturnValue = {"name" : name, "version" : versio}
return jsonReturnValue
}
*/

def getVersion(json_file_path){
  def inputFile = new File(json_file_path)
  def InputJSON = new JsonSlurper().parse(inputFile)
  def version = InputJSON.version 
return version
}

def getName(json_file_path){
  def inputFile = new File(json_file_path)
  def InputJSON = new JsonSlurper().parse(inputFile)
  def name = InputJSON.name 
return name
}
