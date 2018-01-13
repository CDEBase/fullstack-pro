pipeline {
  agent any
  stages {
    stage ('frontend server'){
      steps{
      //  sh 'docker login -u _json_key -p "$(cat /key.json)" https://gcr.io'
        getVersion()
        sh """
          cd servers/frontend-server/
          docker build -t gcr.io/stack-test-186501/frontend .
          docker push gcr.io/stack-test-186501/frontend
          docker rmi gcr.io/stack-test-186501/frontend
        """
      }
    }
    
    stage ('backend server'){
      steps{
        sh 'docker login -u _json_key -p "$(cat /key.json)" https://gcr.io'
        sh """
          cd servers/backend-server/
          docker build -t gcr.io/stack-test-186501/backend .
          docker push gcr.io/stack-test-186501/backend
          docker rmi gcr.io/stack-test-186501/backend
        """
      }
    }
  }
post {
        success{
            build 'kube-orchestration'
        }
}
}

import groovy.json.JsonSlurper
def getVersion(){
  def inputFile = new File("/var/jenkins_home/workspace/fullstack-pro/package.json")
  def InputJSON = new JsonSlurper().parse(inputFile)
  inputJson.each { k, v ->
  println k
}
  echo InputJson.version
}
