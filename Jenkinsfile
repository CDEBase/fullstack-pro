// Global Variable so it can be changed between stages
def GIT_BRANCH_NAME=getGitBranchName()

pipeline {
  agent {
    kubernetes{
      label 'slave-2cpu-8gb'
    }
  }
  parameters {
    string(name: 'REPOSITORY_SERVER', defaultValue: 'gcr.io/stack-test-186501', description: 'Registry server URL to pull/push images', trim: true)
    string(name: 'NAMESPACE', defaultValue: 'default', description: 'In which namespace micro services needs to be deploy', trim: true)
    string(name: 'CONNECTION_ID', defaultValue: 'test', description: 'connection id', trim: true)
    string(name: 'WORKSPACE_ID', defaultValue: 'fullstack-pro', description: 'workspace id', trim: true)
    string(name: 'UNIQUE_NAME', defaultValue: 'default', description: 'chart name', trim: true)
    string(name: 'HEMERA_LOG_LEVEL', defaultValue: 'info', description: 'log level for hemera')
    string(name: 'LOG_LEVEL', defaultValue: 'info', description: 'log level')
    string(name: 'DEPLOYMENT_PATH', defaultValue: '/servers', description: 'folder path to load helm charts')
    string(name: 'PUBLISH_BRANCH', defaultValue: 'devpublish', description: 'publish branch')
    string(name: 'EXCLUDE_SETTING_NAMESPACE_FILTER', defaultValue: 'brigade', description: 'exclude setting namespace that matches search string')
    string(name: 'GIT_CREDENTIAL_ID', defaultValue: 'fullstack-pro-github-deploy-key', description: 'jenkins credential id of git deploy secret')
    string(name: 'REPOSITORY_SSH_URL', defaultValue: 'git@github.com:cdmbase/fullstack-pro.git', description: 'ssh url of the git repository')
    string(name: 'REPOSITORY_BRANCH', defaultValue: 'develop', description: 'the branch of repository')
    string(name: 'DEVELOP_BRANCH', defaultValue: 'develop', description: 'Develop branch as default for the development.')
    string(name: 'MASTER_BRANCH', defaultValue: 'master', description: 'Master branch as default branch for production.')

    // by default first value of the choice will be choosen
    choice choices: ['auto', 'force'], description: 'Choose merge strategy', name: 'NPM_PUBLISH_STRATEGY'
    choice choices: ['yarn', 'npm'], description: 'Choose build strategy', name: 'BUILD_STRATEGY'
    choice choices: ['0.4.0', '0.3.0', '0.1.22'], description: 'Choose Idestack chart version', name: 'IDESTACK_CHART_VERSION'
    choice choices: ['nodejs14', 'nodejs12'], description: 'Choose NodeJS version', name: 'NODEJS_TOOL_VERSION'    
    choice choices: ['buildOnly', 'buildAndTest', 'buildAndPublish',  'mobileBuild', 'mobilePreview', 'devDeployOnly', 'stageDeploy', 'prodDeploy', 'prodDeployOnly', 'allenv'], description: 'Where to deploy micro services?', name: 'ENV_CHOICE'
    booleanParam (defaultValue: false, description: 'Tick to enable debug mode', name: 'ENABLE_DEBUG')
    string(name: 'BUILD_TIME_OUT', defaultValue: '120', description: 'Build timeout in minutes', trim: true)
  }

 // Setup common + secret key variables for pipeline.
  environment {
    BUILD_COMMAND = getBuildCommand()
    PYTHON='/usr/bin/python'
    GCR_KEY = credentials('jenkins-gcr-login-key')
    EXPO_TOKEN = credentials('expo_cdmbase_token')
    GIT_PR_BRANCH_NAME = getGitPrBranchName()
    GITHUB_HELM_REPO_TOKEN = credentials('github-helm-repo-access-token')
  }

  // Initialize npm and docker commands using plugins
  tools {
    nodejs params.NODEJS_TOOL_VERSION
  }

  stages {

    stage('define environment') {
      steps {
        // skip the build if ends with `[skip ci]` which is equivalent to regex `.*\[skip ci\]$`
        scmSkip(deleteBuild: true, skipPattern:'.*\\[skip ci\\]\\s')
        checkout([$class: 'GitSCM', branches: [[name: '*/'+ params.REPOSITORY_BRANCH]],
        doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'WipeWorkspace']],
        submoduleCfg: [], userRemoteConfigs: [[credentialsId: params.GIT_CREDENTIAL_ID, url: params.REPOSITORY_SSH_URL]]])
        sh "git checkout ${env.GIT_PR_BRANCH_NAME}"
      }
    }

    stage('Unlock secrets'){ //unlock keys for all runs
      environment{ deployment_env = 'dev' }
      steps{
        sh '''
           gpg --import /tmp/gpg-public-key/gpg-public-key.pub
           gpg --import /tmp/gpg-private-key/gpg-private-key.key
           git-crypt unlock
        '''
        load "./jenkins_variables.groovy"
        // if we need to load stag configuration for different location.
        // sh "curl -H 'Authorization: token ${env.GITHUB_ACCESS_TOKEN}' -H 'Accept: application/vnd.github.v3.raw' -O -L https://raw.githubusercontent.com/cdmbase/kube-orchestration/master/idestack/values-stage.yaml"
      }
    }

  stage('Release?') {
    // Don't allocate an agent because we don't want to block our
    // slaves while waiting for user input.
    agent none
    when {
      // You forgot the 'env.' in your example above ;)
      expression { env.BRANCH_NAME ==~ /^qa[\w-_]*$/ }
    }
    options {
      // Optionally, let's add a timeout that we don't allow ancient
      // builds to be released.
      timeout time: 14, unit: 'DAYS' 
    }
    steps {
      // Optionally, send some notifications to the approver before
      // asking for input. You can't do that with the input directive
      // without using an extra stage.
      slackSend (color: '#FF0000', message: "Approve Release:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'  to be approved. click <${env.RUN_DISPLAY_URL}|here> to see the log.", channel: 'idestack-automation')

      // The input statement has to go to a script block because we
      // want to assign the result to an environment variable. As we 
      // want to stay as declarative as possible, we put noting but
      // this into the script block.
      script {
        // Assign the 'DO_RELEASE' environment variable that is going
        //  to be used in the next stage.
        env.DO_RELEASE = input {
          message "Want to deploy fullstack-pro on prod cluster?"
          parameters {
            choice choices: ['yes', 'no'], description: 'Want to deploy micro service on prod?', name: 'PROD_DEPLOYMENT'
          }
        }
      }
      // In case you approved multiple pipeline runs in parallel, this
      // milestone would kill the older runs and prevent deploying
      // older releases over newer ones.
      milestone 1
    }
  }
  stage('Release') {
    // We need a real agent, because we want to do some real work.
    agent any
    when {
      // Evaluate the 'when' directive before allocating the agent.
      beforeAgent true
      // Only execute the step when the release has been approved.
      environment name: 'DO_RELEASE', value: 'yes'
    }
    steps {
      // Make sure that only one release can happen at a time.
      lock('release') {
        // As using the first milestone only would introduce a race 
        // condition (assume that the older build would enter the 
        // milestone first, but the lock second) and Jenkins does
        // not support inter-stage locks yet, we need a second 
        // milestone to make sure that older builds don't overwrite
        // newer ones.
        milestone 2

        // Now do the actual work here.
        ...
      }
    }

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
  if(params.ENV_CHOICE == 'mobileBuild'){
    return 'build:auto'
  }
  if(params.ENV_CHOICE == 'mobilePreview'){
    return 'build:preview'
  }
  if(params.ENABLE_DEBUG.toBoolean()){
    return 'build:debug'
  } else {
    return 'build'
  }
}

def getGitPrBranchName() {
    // The branch name could be in the BRANCH_NAME or GIT_BRANCH variable depending on the type of job
  //def branchName = env.BRANCH_NAME ? env.BRANCH_NAME : env.GIT_BRANCH
  //return branchName || ghprbSourceBranch
  if(env.ghprbSourceBranch){
    return env.ghprbSourceBranch
  } else {
    return params.REPOSITORY_BRANCH
  }
}

def getGitBranchName(){ // we can place some conditions in future
  if(env.ghprbSourceBranch){
    return env.ghprbSourceBranch
  } else {
    return params.REPOSITORY_BRANCH
  }
}

@NonCPS
//TODO: Fix below get method for Jenkins slave if possible.
def getDirs1(path){
  def currentDir = new File(path)
  def dirs = []
  currentDir.eachDir() {
      dirs << it.name
  }
  return dirs
}

// Below function to work in Jenkins slave
def getDirs(path){
    def currentDir = sh(script: "ls -CF "+path+" | tr '/' ' '", returnStdout: true)
    def dirs = []
    (currentDir.split()).each {
      dirs << "${it}"
    }
    return dirs
}

def generateStage(server, environmentType) {
  return {
    stage("stage: ${server}") {
      echo "This is ${server}."
      def filterExist = "${server}".contains(params.EXCLUDE_SETTING_NAMESPACE_FILTER)
      def namespace = filterExist ? '' : "--namespace=${params.NAMESPACE}"
      def name = getName(pwd() + "${params.DEPLOYMENT_PATH}/${server}/package.json")
      def version = getVersion(pwd() + params.DEPLOYMENT_PATH + "/${server}/package.json")
      def valuesFile = "values-${environmentType}.yaml"
      // deploy anything matching `*backend-server` or `*frontend-server` to use idestack chart
      try{
        if ("${server}".endsWith("backend-server") | "${server}".endsWith("frontend-server")) {
          echo "add deployment flag to - ${server} "

          if ("${server}".endsWith("frontend-server")){
            deployment_flag = " --set backend.enabled='false' --set external.enabled='true'"
          }

          if ("${server}".endsWith("backend-server")){
            deployment_flag = " --set frontend.enabled='false' --set external.enabled='false' --set ingress.enabled=false "
          }

          sh """
            helm upgrade -i \
            ${UNIQUE_NAME}-${server} \
            -f "${valuesFile}" \
            ${namespace} \
            ${deployment_flag} \
            --set frontend.image="${REPOSITORY_SERVER}/${name}" \
            --set frontend.imageTag=${version} \
            --set backend.image="${REPOSITORY_SERVER}/${name}" \
            --set backend.imageTag=${version} \
            --set settings.workspaceId="${WORKSPACE_ID}" \
            --set frontend.pullPolicy=Always \
            --set backend.pullPolicy=Always \
            --version=${IDESTACK_CHART_VERSION} \
              kube-orchestration/idestack
            """

        } else {
          sh """
            cd .${params.DEPLOYMENT_PATH}/${server}
            helm upgrade -i \
            ${UNIQUE_NAME}-${server}-api \
            -f "charts/chart/${valuesFile}" \
            ${namespace} \
            --set image.repository=${REPOSITORY_SERVER}/${name} \
            --set image.tag=${version} \
            charts/chart
          """

        }
      } catch (Exception err) {
        slackSend (color: '#FF0000', message: "FAILED:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'  Job failed in stage deployment ${server}. click <${env.RUN_DISPLAY_URL}|here> to see the log. Error: ${err.toString()}", channel: 'idestack-automation')
        println err
        throw(err)
      }
    }
  }
}

// Docker build parllel loop
def generateBuildStage(server) {
  return {
    stage("stage: ${server}") {
     try{
      echo "This is ${server}."
      def name = getName(pwd() + params.DEPLOYMENT_PATH + "/${server}/package.json")
      def version = getVersion(pwd() + params.DEPLOYMENT_PATH + "/${server}/package.json")
        sh """
            lerna exec --scope=*${server} ${params.BUILD_STRATEGY} run docker:${env.BUILD_COMMAND};
            docker tag ${name}:${version} ${REPOSITORY_SERVER}/${name}:${version}
            docker push ${REPOSITORY_SERVER}/${name}:${version}
            docker rmi ${REPOSITORY_SERVER}/${name}:${version}
        """
      } catch (e) {
        slackSend (color: '#FF0000', message: "FAILED:  Job  '${env.JOB_NAME}'  BUILD NUMBER:  '${env.BUILD_NUMBER}'  Job failed in stage docker-build ${server}. click <${env.RUN_DISPLAY_URL}|here> to see the log. Error: ${e}", channel: 'idestack-automation')
        throw(e)
      }
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
