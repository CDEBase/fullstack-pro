// Global Variable so it can be changed between stages
def GIT_BRANCH_NAME=getGitBranchName()

pipeline {
  agent any
  parameters {
    string(name: 'REPOSITORY_SERVER', defaultValue: 'gcr.io/stack-test-186501', description: 'Registry server URL to pull/push images', trim: true)
    string(name: 'NAMESPACE', defaultValue: 'default', description: 'In which namespace micro services needs to be deploy', trim: true)
    string(name: 'CONNECTION_ID', defaultValue: 'test', description: 'connection id', trim: true)
    string(name: 'WORKSPACE_ID', defaultValue: 'fullstack-pro', description: 'workspace id', trim: true)
    string(name: 'UNIQUE_NAME', defaultValue: 'fullstack-pro', description: 'chart name', trim: true)
    string(name: 'HEMERA_LOG_LEVEL', defaultValue: 'info', description: 'log level for hemera')
    string(name: 'LOG_LEVEL', defaultValue: 'info', description: 'log level')
    // by default first value of the choice will be choosen
    choice choices: ['buildOnly', 'buildAndPublish', 'dev', 'stage', 'prod', 'allenv'], description: 'Where to deploy micro services?', name: 'ENV_CHOICE'
    booleanParam (defaultValue: false, description: 'Tick to enable debug mode', name: 'DEBUG')
  }

  // Setup common + secret key variables for pipeline.
  environment {
    BUILD_COMMAND = getBuildCommand()
    PYTHON='/usr/bin/python'
    GCR_KEY = credentials('jenkins-gcr-login-key')
    GCLOUDSECRETKEY = credentials('jenkins_gcp_access_key')
    GIT_PR_BRANCH_NAME = getGitPrBranchName()
  }

  // Initialize npm and docker commands using plugins
  tools {
    nodejs 'nodejs'
    'org.jenkinsci.plugins.docker.commons.tools.DockerTool' 'docker'
  }

  stages {

    stage('define environment') {
      checkout([$class: 'GitSCM', branches: [[name: '*/devpublish']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CleanBeforeCheckout']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github-deploy-keys', url: 'git@github.com:cdmbase/fullstack-pro.git']]])
      env.NODEJS_HOME = "${tool 'node_v8'}"
	    env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
	    sh 'npm --version'
    }
    stage('Unlock secrets'){ //unlock keys for all runs
      environment{ deployment_env = 'dev' }
      steps{
        sh 'git-crypt unlock'
        load "./jenkins_variables.groovy"
        sh "curl -H 'Authorization: token ${env.GITHUB_ACCESS_TOKEN}' -H 'Accept: application/vnd.github.v3.raw' -O -L https://raw.githubusercontent.com/cdmbase/kube-orchestration/master/idestack/values-stage.yaml"
      }
    }

    // Install packages. If
    // a. any branch
    // b. ENV_CHOICE set not selected `dev`, `stage` or `prod`
    stage ('Install git repository'){
      when {  expression { params.ENV_CHOICE == 'allenv' || params.ENV_CHOICE == 'buildOnly' } }
       steps{
          sh """
            echo "what is docker git version $GIT_BRANCH_NAME -- ${params.ENV_CHOICE}"
            git checkout ${env.GIT_PR_BRANCH_NAME}
            npm install
            npm run lerna
          """
       }
    }

    // Run build for all cases except when ENV_CHOICE is 'buildAndPublish' and `dev`, `stage` or `prod`
    stage ('Build packages'){
      when {  expression { params.ENV_CHOICE == 'allenv' || params.ENV_CHOICE == 'buildOnly' } }
       steps{
          sh """
            npm run build
          """
       }
    }
    // if PR is from branch other than `develop` then merge to `develop` if we chose ENV_CHOICE as 'buildAndPublish'.
    stage ('Merge PR to `develop` branch and publish'){
      when {
        expression { params.GIT_PR_BRANCH_NAME != 'develop' }
        expression { params.ENV_CHOICE == 'buildAndPublish' }
      }
      steps{
        sh """
          git checkout develop
          git merge ${env.GIT_PR_BRANCH_NAME} -m 'auto merging'
          npm install
          npm run lerna
          npm run build
        """
        script {
          GIT_BRANCH_NAME = 'develop'
        }
      }
    }

    // publish packages to npm repository.
    // commit new package-lock.json that might get generated during install
    stage ('Publish packages'){
      when {
        expression { GIT_BRANCH_NAME == 'develop' }
        expression { params.ENV_CHOICE == 'buildOnly' ||  params.ENV_CHOICE == 'buildAndPublish' }
      }
      steps{
        script {
          GIT_BRANCH_NAME='devpublish'
        }
        sshagent (credentials: ['github-deploy-keys']) {
          sh """
            git add -A
            (git diff --quiet && git diff --staged --quiet) || git commit -am 'auto commit'
            npm run devpublish:auto
            git push origin develop
            git checkout devpublish
          """
        }
      }
    }
    stage('Docker login'){
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
      }
      steps{
        sh 'cat "$GCR_KEY" | docker login -u _json_key --password-stdin https://gcr.io'
      }
    }

    stage('Build Docker Images') {
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
        expression { params.ENV_CHOICE == 'allenv' || params.ENV_CHOICE == 'buildOnly' || params.ENV_CHOICE == 'buildAndPublish' }
      }

      // Below variable is only set to load all (variables, functions) from jenkins_variables.groovy file.
      environment{ deployment_env = 'dev' }
      // Below code build stages only run when user select option: 'allenv'. Below jobs run parallel.
      parallel {
        stage ('frontend server'){
          when { expression { params.ENV_CHOICE == 'allenv' } }
          steps{
            load "./jenkins_variables.groovy"
            sh """
              lerna exec --scope=*frontend-server npm run docker:${BUILD_COMMAND}
              cd servers/tracer-server/
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
    stage('Get Dev Secrets'){
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
        expression { params.ENV_CHOICE == 'dev' || params.ENV_CHOICE == 'allenv' || params.ENV_CHOICE == 'buildOnly' || params.ENV_CHOICE == 'buildAndPublish' }
        beforeInput true
      }
      steps{
        sh """
          gcloud auth activate-service-account --key-file """ + GCLOUDSECRETKEY + """
          gcloud container clusters get-credentials deployment-cluster --zone us-central1-a
          helm repo update
        """
      }
    }

    stage('Dev deployment') {
      environment{ deployment_env = 'dev' }
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
        expression { params.ENV_CHOICE == 'dev' || params.ENV_CHOICE == 'allenv' || params.ENV_CHOICE == 'buildOnly' || params.ENV_CHOICE == 'buildAndPublish' }
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
      parallel{
        stage('Fullstack-pro Deployment'){
          //when {environment name: 'DEV_DEPLOYMENT', value: 'yes'}
          steps{
            load "./jenkins_variables.groovy"
            sh """
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

        stage('Hemera Server Deployment'){
          steps{
            load "./jenkins_variables.groovy"
            sh """
                helm upgrade -f ./hemera-dev-values.yaml -i ${UNIQUE_NAME}-hemera-server --namespace=${NAMESPACE} \
                --set image.repository="${REPOSITORY_SERVER}/${env.HEMERA_PACKAGE_NAME}" \
                --set image.tag="${env.HEMERA_PACKAGE_VERSION}" ./servers/hemera-server/charts/hemera-server
            """
          }
        }
      }
    } // End of dev deployment code block.


  // Below are stage code block
    stage('Get Stage Secrets'){
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
        expression { params.ENV_CHOICE == 'stage' || params.ENV_CHOICE == 'allenv' }
        beforeInput true
      }
      steps{
        sh """
          gcloud auth activate-service-account --key-file """ + GCLOUDSECRETKEY + """
          gcloud container clusters get-credentials deployment-cluster --zone us-central1-a
          helm repo update
        """
      }
    }

    stage('Stage deployment') {
      environment{ deployment_env = 'stage'}
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
        expression { params.ENV_CHOICE == 'stage' || params.ENV_CHOICE == 'allenv' }
        beforeInput true
      }

      input {
        message "Want to deploy fullstack-pro on stage cluster?"
        parameters {
          choice choices: ['yes', 'no'], description: 'Want to deploy micro service on stage?', name: 'STAGE_DEPLOYMENT'
        }
      }

      // Stages only run if user select env 'stage' or 'allenv' .
      // NOTE: All jobs will run sequentially to prevent deployment on wrong cluster.
      parallel{
        stage('Fullstack-pro Deployment'){
          //when {environment name: 'STAGE_DEPLOYMENT', value: 'yes'}
          steps{
            load "./jenkins_variables.groovy"
            sh """
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

        stage('Hemera Server Deployment'){
          steps{
            load "./jenkins_variables.groovy"
            sh """
                helm upgrade -f ./values-adminide-stage.yaml -i ${UNIQUE_NAME}-hemera-server --namespace=${NAMESPACE} \
                --set image.repository="${REPOSITORY_SERVER}/${env.HEMERA_PACKAGE_NAME}" \
                --set image.tag="${env.HEMERA_PACKAGE_VERSION}" ./servers/hemera-server/charts/hemera-server
            """
          }
        }
      }
    } // End of Stage deployment code block.

  // Below are production stages
    stage('Get Prod Secrets'){
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
        expression { params.ENV_CHOICE == 'prod' || params.ENV_CHOICE == 'allenv' }
        beforeInput true
      }
      steps{
        sh """
          gcloud auth activate-service-account --key-file """ + GCLOUDSECRETKEY + """
          gcloud container clusters get-credentials deployment-cluster --zone us-central1-a
          helm repo update
        """
      }
    }

    stage('Prod deployment') {
      environment{ deployment_env = 'prod'}
      when {
        expression { GIT_BRANCH_NAME == 'devpublish' }
        expression {params.ENV_CHOICE == 'prod' || params.ENV_CHOICE == 'allenv'}
        beforeInput true
      }

      input {
        message "Want to deploy fullstack-pro on prod cluster?"
        parameters {
          choice choices: ['yes', 'no'], description: 'Want to deploy micro service on prod?', name: 'PROD_DEPLOYMENT'
        }
      }

      // Stages only run if user select env 'prod' or 'allenv' .
      //NOTE: All jobs will run sequentially to prevent deployment on wrong cluster.
      parallel{
        stage('Fullstack-pro Deployment'){
          //when {environment name: 'PROD_DEPLOYMENT', value: 'yes'}
          steps{
            load "./jenkins_variables.groovy"
            sh """
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

        stage('Hemera Server Deployment'){
          steps{
            load "./jenkins_variables.groovy"
            sh """
                helm upgrade -f ./values-adminide-prod.yaml -i ${UNIQUE_NAME}-hemera-server --namespace=${NAMESPACE} \
                --set image.repository="${REPOSITORY_SERVER}/${env.HEMERA_PACKAGE_NAME}" \
                --set image.tag="${env.HEMERA_PACKAGE_VERSION}" ./servers/hemera-server/charts/hemera-server
            """
          }
        }
      }
    } // End of production deployment code block.
  }

  post {
    always {
      deleteDir()
    }
    success{
      slackSend (color: '#00FF00', message: "SUCCESSFUL:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'  Job success. click <${env.RUN_DISPLAY_URL}|here> to see the log.", channel: 'idestack-automation')
    }
    failure{
      slackSend (color: '#FF0000', message: "FAILED:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'  Job failed. click <${env.RUN_DISPLAY_URL}|here> to see the log.", channel: 'idestack-automation')
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

def getGitPrBranchName() {
  // The branch name could be in the BRANCH_NAME or GIT_BRANCH variable depending on the type of job
  //def branchName = env.BRANCH_NAME ? env.BRANCH_NAME : env.GIT_BRANCH
  //return branchName || ghprbSourceBranch
  return ghprbSourceBranch
}

def getGitBranchName() { // we can place some conditions in future
  return ghprbSourceBranch
}
