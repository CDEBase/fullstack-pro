pipeline {
  agent any
  parameters {
      string(name: 'REPOSITORY_SERVER', defaultValue: 'gcr.io/stack-test-186501', description: 'Google container registry to pull/push images')
      string(name: 'NAMESPACE', defaultValue: 'adminide', description: 'In which namespace micro services needs to be deploy', trim: true)
      string(name: 'CONNECTION_ID', defaultValue: 'test', description: 'connection id')
      string(name: 'WORKSPACE_ID', defaultValue: 'fullstack-pro', description: 'workspaceID')
      string(name: 'UNIQUE_NAME', defaultValue: 'fullstack-pro', description: 'chart name')
      string(name: 'HEMERA_LOG_LEVEL', defaultValue: 'info', description: 'log level for hemera')
      string(name: 'LOG_LEVEL', defaultValue: 'info', description: 'log level')
      choice choices: ['dev', 'stage', 'prod', 'allenv'], description: 'Where to deploy micro services?', name: 'ENV_CHOICE'
      booleanParam (defaultValue: false, description: 'Tick to enable debug mode', name: 'DEBUG')
  }

  // Setup common + secret key variables for pipeline.
  environment {
      BUILD_COMMAND = getBuildCommand()
      PYTHON='/usr/bin/python'
      GCR_KEY = credentials('jenkins-gcr-login-key')
      GCLOUDSECRETKEY = credentials('jenkins_gcp_access_key')
  }

  // Initialize npm and docker commands using plugins
  tools {
        nodejs 'nodejs'
        'org.jenkinsci.plugins.docker.commons.tools.DockerTool' 'docker'
    }

  stages {
    stage ('dependencies'){
      when { expression { params.ENV_CHOICE == 'allenv' } }
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
      when { expression { params.ENV_CHOICE == 'allenv' } }
      steps{
           sh 'cat "$GCR_KEY" | docker login -u _json_key --password-stdin https://gcr.io'
        }
      }

  stage("Docker Build") {
    parallel {
      stage ('frontend server'){
        when { expression { params.ENV_CHOICE == 'allenv' } }
        steps{
          load "./jenkins_variables.groovy"
          sh """
            lerna exec --scope=*frontend-server npm run docker:${BUILD_COMMAND}
            cd servers/frontend-server/
            docker tag ${env.FRONTEND_PACKAGE_NAME}:${env.FRONTEND_PACKAGE_VERSION} ${REPOSITORY_SERVER}/${env.FRONTEND_PACKAGE_NAME}:${env.FRONTEND_PACKAGE_VERSION}
            docker push ${REPOSITORY_SERVER}/${env.FRONTEND_PACKAGE_NAME}:${env.FRONTEND_PACKAGE_VERSION}
            docker rmi ${REPOSITORY_SERVER}/${env.FRONTEND_PACKAGE_NAME}:${env.FRONTEND_PACKAGE_VERSION}
          """
      }
     }

      stage ('backend server'){
        when { expression { params.ENV_CHOICE == 'allenv' } }
        steps{
          load "./jenkins_variables.groovy"
          sh """
            lerna exec --scope=*backend-server npm run docker:${BUILD_COMMAND}
            cd servers/backend-server/
            docker tag ${env.BACKEND_PACKAGE_NAME}:${env.BACKEND_PACKAGE_VERSION} ${REPOSITORY_SERVER}/${env.BACKEND_PACKAGE_NAME}:${env.BACKEND_PACKAGE_VERSION}
            docker push ${REPOSITORY_SERVER}/${env.BACKEND_PACKAGE_NAME}:${env.BACKEND_PACKAGE_VERSION}
            docker rmi ${REPOSITORY_SERVER}/${env.BACKEND_PACKAGE_NAME}:${env.BACKEND_PACKAGE_VERSION}
          """
      }
      }

      stage ('hemera server'){
        when { expression { params.ENV_CHOICE == 'allenv' } }
        steps{
          load "./jenkins_variables.groovy"
          sh """
            lerna exec --scope=*hemera-server npm run docker:${BUILD_COMMAND}
            cd servers/hemera-server/
            docker tag ${env.HEMERA_PACKAGE_NAME}:${env.HEMERA_PACKAGE_VERSION} ${REPOSITORY_SERVER}/${env.HEMERA_PACKAGE_NAME}:${env.HEMERA_PACKAGE_VERSION}
            docker push ${REPOSITORY_SERVER}/${env.HEMERA_PACKAGE_NAME}:${env.HEMERA_PACKAGE_VERSION}
            docker rmi ${REPOSITORY_SERVER}/${env.HEMERA_PACKAGE_NAME}:${env.HEMERA_PACKAGE_VERSION}
          """
      }
     }
    }
  }

  // Below are dev stages
            stage('Dev deployment') {
              when {
                expression {params.ENV_CHOICE == 'dev' || params.ENV_CHOICE == 'allenv'}
                beforeInput true
              }

              //input {
              //      message "Want to deploy fullstack-pro on dev cluster?"
              //      parameters {
              //           choice choices: ['yes', 'no'], description: 'Want to deploy micro service on dev?', name: 'DEV_DEPLOYMENT'
              //      }
              //}

              // Stages only run if user select env 'dev' or 'allenv' .
              //NOTE: All jobs will run sequentially to prevent deployment on wrong cluster.
              stages{
                stage('Fullstack-pro Deployment'){
                    //when {environment name: 'DEV_DEPLOYMENT', value: 'yes'}
                    steps{
                        load "./jenkins_variables.groovy"
                        sh """
                            gcloud auth activate-service-account --key-file """ + GCLOUDSECRETKEY + """
                            gcloud container clusters get-credentials deployment-cluster --zone us-central1-a

                            helm repo update
                            helm upgrade -i \
                            --set frontend.image="${REPOSITORY_SERVER}/${env.FRONTEND_PACKAGE_NAME}" \
                            --set frontend.imageTag=${env.FRONTEND_PACKAGE_VERSION} \
                            --set backend.image="${REPOSITORY_SERVER}/${env.BACKEND_PACKAGE_NAME}" \
                            --set backend.imageTag=${env.BACKEND_PACKAGE_VERSION} \
                            --set settings.workspaceId="${WORKSPACE_ID}" \
                            --set frontend.pullPolicy=Always \
                            --set backend.pullPolicy=Always \
                            --set ingress.domain=cdebase.io \
                            --namespace=${NAMESPACE} ${UNIQUE_NAME} kube-orchestration/idestack
                          """
                    }
                }
              }
            } // End of dev deployment code block.

}

    post {
        always {
            deleteDir()
        }
        success{
          slackSend (color: '#00FF00', message: "SUCCESSFUL:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'", channel: 'idestack-automation')
        }
        failure{
          slackSend (color: '#FF0000', message: "FAILED:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'", channel: 'idestack-automation')
        }
    }
}

def getBuildCommand(){
  if(DEBUG.toBoolean()){
    return 'build:debug'
  } else {
    return 'build'
  }
}
