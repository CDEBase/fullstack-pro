pipeline {
  agent any
  parameters {
    string(name: 'REPOSITORY_SERVER', defaultValue: 'gcr.io/stack-test-186501', description: 'container repository registry')
    string(name: 'NAMESPACE', defaultValue: 'default', description: 'namespace')
    string(name: 'WORKSPACE_ID', defaultValue: 'fullstack-pro', description: 'workspaceID')
    string(name: 'UNIQUE_NAME', defaultValue: 'fullstack-pro', description: 'chart name') 
  } 
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
  
  stage("Docker Build") {
    parallel {  
      stage ('frontend server'){
        steps{
          sh """
            cd servers/frontend-server/
            npm run docker:build
            docker tag $FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION ${REPOSITORY_SERVER}/$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
            docker push ${REPOSITORY_SERVER}/$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
            docker rmi ${REPOSITORY_SERVER}//$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
          """
        }
      }

      stage ('backend server'){
        steps{
          sh """
            cd servers/backend-server/
            npm run docker:build
            docker tag $BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION ${REPOSITORY_SERVER}/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
            docker push ${REPOSITORY_SERVER}/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
            docker rmi ${REPOSITORY_SERVER}/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
          """
        }
      }

      stage ('hemera server'){
        steps{
          sh """
            cd servers/hemera-server/
            npm run docker:build
            docker tag $HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION ${REPOSITORY_SERVER}/$HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION
            docker push ${REPOSITORY_SERVER}/$HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION
            docker rmi ${REPOSITORY_SERVER}/$HEMERA_PACKAGE_NAME:$HEMERA_PACKAGE_VERSION
          """
        }
      }
    }
  }

      stage('Chart Deployment'){
        steps{
          sh """
            helm repo update
            helm upgrade -i \
            --set frontend.image="${REPOSITORY_SERVER}/${FRONTEND_PACKAGE_NAME}" \
            --set frontend.imageTag=${FRONTEND_PACKAGE_VERSION} \
            --set backend.image="${REPOSITORY_SERVER}/${BACKEND_PACKAGE_NAME}" \
            --set backend.imageTag=${BACKEND_PACKAGE_VERSION} \
            --set settings.workspaceId="${WORKSPACE_ID}" \
            --set frontend.pullPolicy=Always \
            --set backend.pullPolicy=Always \
            --namespace=${NAMESPACE} ${UNIQUE_NAME} kube-orchestration/idestack
          """
          }
      }
}

    post {
        success{
          slackSend (color: '#00FF00', message: "SUCCESSFUL:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'", channel: 'idestack-automation')
        }
        failure{
          slackSend (color: '#FF0000', message: "FAILED:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'", channel: 'idestack-automation')
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
