pipeline {
  agent any
  parameters {
    string(name: 'REPOSITORY_SERVER', defaultValue: 'gcr.io/stack-test-186501', description: 'Google container registry to pull/push images')
    string(name: 'NAMESPACE', defaultValue: 'default', description: 'namespace')
    string(name: 'CONNECTION_ID', defaultValue: 'test', description: 'connection id')
    string(name: 'WORKSPACE_ID', defaultValue: 'fullstack-pro', description: 'workspaceID')
    string(name: 'UNIQUE_NAME', defaultValue: 'fullstack-pro', description: 'chart name')
    string(name: 'DEBUGGING', defaultValue: 'false', description: 'debugging')
    string(name: 'HEMERA_LOG_LEVEL', defaultValue: 'info', description: 'log level for hemera')
    string(name: 'LOG_LEVEL', defaultValue: 'info', description: 'log level')
    choice(choices: 'All\nDev\nStage\nAllwithForce', description: 'defining environment to deploy chart on', name: 'Env')
  }
  environment {
    FRONTEND_PACKAGE_NAME = getName("./servers/frontend-server/package.json")
    FRONTEND_PACKAGE_VERSION = getVersion("./servers/frontend-server/package.json")
    BACKEND_PACKAGE_NAME = getName("./servers/backend-server/package.json")
    BACKEND_PACKAGE_VERSION = getVersion("./servers/backend-server/package.json")
    HEMERA_PACKAGE_NAME = getName("./servers/hemera-server/package.json")
    HEMERA_PACKAGE_VERSION = getVersion("./servers/hemera-server/package.json")
    PYTHON='/usr/bin/python'
    GCR_KEY = credentials('jenkins-gcr-login-key')
    GCLOUDSECRETKEY = credentials('jenkins_gcp_access_key')
  }

  tools {
        nodejs 'nodejs'
        'org.jenkinsci.plugins.docker.commons.tools.DockerTool' 'docker'
    }

  stages {
    stage ('dependencies'){
      steps{
        sh """
          npm install
          npm install -g lerna
          npm run lerna
          npm run build
          """
      }
    }

    stage('Docker login'){
      steps{
           sh 'cat "$GCR_KEY" | docker login -u _json_key --password-stdin https://gcr.io'
        }
      }

  stage("Docker Build") {
    parallel {
      stage ('frontend server'){
        steps{
          sh """
            lerna exec --scope=*frontend-server npm run docker:build
            cd servers/frontend-server/
            docker tag ${FRONTEND_PACKAGE_NAME}:${FRONTEND_PACKAGE_VERSION} ${REPOSITORY_SERVER}/${FRONTEND_PACKAGE_NAME}:${FRONTEND_PACKAGE_VERSION}
            docker push ${REPOSITORY_SERVER}/${FRONTEND_PACKAGE_NAME}:${FRONTEND_PACKAGE_VERSION}
            docker rmi ${REPOSITORY_SERVER}/${FRONTEND_PACKAGE_NAME}:${FRONTEND_PACKAGE_VERSION}
          """
      }
     }

      stage ('backend server'){
        steps{
          sh """
            lerna exec --scope=*backend-server npm run docker:build
            cd servers/backend-server/
            docker tag ${BACKEND_PACKAGE_NAME}:${BACKEND_PACKAGE_VERSION} ${REPOSITORY_SERVER}/${BACKEND_PACKAGE_NAME}:${BACKEND_PACKAGE_VERSION}
            docker push ${REPOSITORY_SERVER}/${BACKEND_PACKAGE_NAME}:${BACKEND_PACKAGE_VERSION}
            docker rmi ${REPOSITORY_SERVER}/${BACKEND_PACKAGE_NAME}:${BACKEND_PACKAGE_VERSION}
          """
      }
      }

      stage ('hemera server'){
        steps{
          sh """
            lerna exec --scope=*hemera-server npm run docker:build
            cd servers/hemera-server/
            docker tag ${HEMERA_PACKAGE_NAME}:${HEMERA_PACKAGE_VERSION} ${REPOSITORY_SERVER}/${HEMERA_PACKAGE_NAME}:${HEMERA_PACKAGE_VERSION}
            docker push ${REPOSITORY_SERVER}/${HEMERA_PACKAGE_NAME}:${HEMERA_PACKAGE_VERSION}
            docker rmi ${REPOSITORY_SERVER}/${HEMERA_PACKAGE_NAME}:${HEMERA_PACKAGE_VERSION}
          """
      }
     }
    }
  }

      stage('Chart Deployment'){
        steps{
          sh """
            gcloud auth activate-service-account --key-file """ + GCLOUDSECRETKEY + """
            gcloud container clusters get-credentials deployment-cluster --zone us-central1-a

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
            --namespace=${NAMESPACE} ${UNIQUE_NAME} kube-orchestration/idestack
            """
          }
      }
}

    post {
        success{
          deleteDir()
          slackSend (color: '#00FF00', message: "SUCCESSFUL:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'", channel: 'idestack-automation')
        }
        failure{
          deleteDir()
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
