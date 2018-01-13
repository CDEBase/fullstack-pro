pipeline {
  agent any
  
  environment {
    PACKAGE_VERSION = getVersion()
  }
  
  stages {
    stage ('frontend server'){
      steps{
        sh 'docker login -u _json_key -p "$(cat /key.json)" https://gcr.io'
        sh """
          cd servers/frontend-server/
          docker build -t gcr.io/stack-test-186501/frontend:$PACKAGE_VERSION .
          docker push gcr.io/stack-test-186501/frontend:$PACKAGE_VERSION
          docker rmi gcr.io/stack-test-186501/frontend:$PACKAGE_VERSION
        """
      }
    }

    stage ('backend server'){
      steps{
        sh 'docker login -u _json_key -p "$(cat /key.json)" https://gcr.io'
        sh """
          cd servers/backend-server/
          docker build -t gcr.io/stack-test-186501/backend:$PACKAGE_VERSION .
          docker push gcr.io/stack-test-186501/backend:$PACKAGE_VERSION
          docker rmi gcr.io/stack-test-186501/backend:$PACKAGE_VERSION
        """
      }
    }
  }
post {
        success{
          echo "success"
            //build 'kube-orchestration'
        }
}
}

import groovy.json.JsonSlurper
def getVersion(){
  def inputFile = new File("/var/jenkins_home/workspace/fullstack-pro/package.json")
  def InputJSON = new JsonSlurper().parse(inputFile)
  def version = InputJSON.version 
return version
}

