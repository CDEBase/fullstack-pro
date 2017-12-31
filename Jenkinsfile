pipeline {
  agent any
  stages {
    stage ('frontend server'){
      steps{
        sh """
          cd servers/frontend-server/
          docker build -t frontend .
          docker images | grep frontend
          docker rmi frontend
        """
      }
    }
  }
}
