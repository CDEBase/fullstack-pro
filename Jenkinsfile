pipeline {
  agent any
  
  environment {
    FRONTEND_PACKAGE_NAME = getName("/var/jenkins_home/workspace/fullstack-pro/servers/frontend-server/package.json")
    FRONTEND_PACKAGE_VERSION = getVersion("/var/jenkins_home/workspace/fullstack-pro/servers/frontend-server/package.json")
    BACKEND_PACKAGE_NAME = getName("/var/jenkins_home/workspace/fullstack-pro/servers/backend-server/package.json")                                       
    BACKEND_PACKAGE_VERSION = getVersion("/var/jenkins_home/workspace/fullstack-pro/servers/backend-server/package.json")
    HEMERA_PACKAGE_NAME = getName("/var/jenkins_home/workspace/fullstack-pro/servers/hemera-server/package.json")                                       
    HEMERA_PACKAGE_VERSION = getVersion("/var/jenkins_home/workspace/fullstack-pro/servers/hemera-server/package.json")
  }
  
  stages {
    stage ('dependencies'){
      steps{
        sh """
          npm install
          npm run lerna
                 """
      }
    }
  
  stage ('docker login'){
      steps{
        sh 'docker login -u _json_key -p "$(cat /var/jenkins_home/cdmbase_keys/key.json)" https://gcr.io'
      }
    }
    
    stage ('frontend server'){
      steps{
        sh """
          cd servers/frontend-server/
          npm run docker:build
          docker tag $FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION gcr.io/stack-test-186501/$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
          docker push gcr.io/stack-test-186501/$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
          docker rmi gcr.io/stack-test-186501//$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
        """
      }
    }

    stage ('backend server'){
      steps{
        sh """
          cd servers/backend-server/
          npm run docker:build
          docker tag $BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION gcr.io/stack-test-186501/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
          docker push gcr.io/stack-test-186501/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
          docker rmi gcr.io/stack-test-186501/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
        """
      }
    }

    stage ('hemera server'){
      steps{
        sh """
          cd servers/hemera-server/
          npm run docker:build
          docker tag $HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION gcr.io/stack-test-186501/$HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION
          docker push gcr.io/stack-test-186501/$HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION
          docker rmi gcr.io/stack-test-186501/$HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION
        """
      }
    }
  }

    post {
        success{
          build job: 'kube-orchestration', parameters: [string(name: 'FRONTEND_PACKAGE_NAME', value: "${FRONTEND_PACKAGE_NAME}"), string(name: 'FRONTEND_PACKAGE_VERSION', value: "${FRONTEND_PACKAGE_VERSION}"), 
          string(name: 'BACKEND_PACKAGE_NAME', value: "${BACKEND_PACKAGE_NAME}"), string(name: 'BACKEND_PACKAGE_VERSION', value: "${BACKEND_PACKAGE_VERSION}"),
          string(name: 'HEMERA_PACKAGE_NAME', value: "${HEMERA_PACKAGE_NAME}"), string(name: 'HEMERA_PACKAGE_VERSION', value: "${HEMERA_PACKAGE_VERSION}")
          ]
        }
    }
}

import groovy.json.JsonSlurper
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