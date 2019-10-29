import hudson.Util;
def pod_label = "worker-${UUID.randomUUID().toString()}"

pipeline {
  agent any
  parameters {
    string(name: 'REPOSITORY_SERVER', defaultValue: 'gcr.io/stack-test-186501', description: 'container repository registry')
    string(name: 'NAMESPACE', defaultValue: 'default', description: 'namespace')
    string(name: 'WORKSPACE_ID', defaultValue: 'fullstack-pro', description: 'workspaceID')
    string(name: 'UNIQUE_NAME', defaultValue: 'fullstack-pro', description: 'chart name')
  }
  environment {
    FRONTEND_PACKAGE_NAME = getName("./servers/frontend-server/package.json")
    FRONTEND_PACKAGE_VERSION = getVersion("./servers/frontend-server/package.json")
    BACKEND_PACKAGE_NAME = getName("./servers/backend-server/package.json")
    BACKEND_PACKAGE_VERSION = getVersion("./servers/backend-server/package.json")
    HEMERA_PACKAGE_NAME = getName("./servers/hemera-server/package.json")
    HEMERA_PACKAGE_VERSION = getVersion("./servers/hemera-server/package.json")
    DOCKER_GCR_LOGIN_KEY = credentials('jenkins-gcr-login-key')
    CLUSTER_KUBE_CONFIG = credentials('cluster-kube-config')
    NODEJS_HOME = tool 'nodejs'
    DOCKER_HOME = tool 'docker'
    PATH="${env.NODEJS_HOME}/bin:${env.DOCKER_HOME}/bin:${env.PATH}"
  }

  stages {
    stage ('dependencies'){
      steps{
        sh """
          ${NODEJS_HOME}/bin/npm install
          ${NODEJS_HOME}/bin/npm install -g lerna
          ${NODEJS_HOME}/bin/npm run lerna
          """
      }
    }

  stage ('docker login'){
      steps{
        sh '''
          docker login -u _json_key -p "$(cat ''' + DOCKER_GCR_LOGIN_KEY + ''')" https://gcr.io
        '''
      }
    }

  stage("Docker Build") {
    parallel {
      stage ('frontend server'){
        steps{
          sh """
            lerna exec --scope=*hemera-server ${NODEJS_HOME}/bin/npm run docker:build
            cd servers/frontend-server/
            docker tag $FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION ${REPOSITORY_SERVER}/$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
            docker push ${REPOSITORY_SERVER}/$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
            docker rmi ${REPOSITORY_SERVER}//$FRONTEND_PACKAGE_NAME:$FRONTEND_PACKAGE_VERSION
          """
      }
     }

      stage ('backend server'){
        steps{
          sh """
            lerna exec --scope=*hemera-server ${NODEJS_HOME}/bin/npm run docker:build
            cd servers/backend-server/
            docker tag $BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION ${REPOSITORY_SERVER}/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
            docker push ${REPOSITORY_SERVER}/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
            docker rmi ${REPOSITORY_SERVER}/$BACKEND_PACKAGE_NAME:$BACKEND_PACKAGE_VERSION
          """
      }
      }

      stage ('hemera server'){
        steps{
          sh """
            lerna exec --scope=*hemera-server ${NODEJS_HOME}/bin/npm run docker:build
            cd servers/hemera-server/
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
            --set ingress.domain=cdebase.io \
            --namespace=${NAMESPACE} ${UNIQUE_NAME} kube-orchestration/idestack \
            --kubeconfig=""" + CLUSTER_KUBE_CONFIG
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
  def inputFile = readFile(json_file_path)
  def InputJSON = new JsonSlurper().parseText(inputFile)
  def version = InputJSON.version
return version
}

def getName(json_file_path){
  def inputFile = readFile(json_file_path)
  def InputJSON = new JsonSlurper().parseText(inputFile)
  def name = InputJSON.name
return name
}
