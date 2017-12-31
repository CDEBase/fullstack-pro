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
    
    stage ('backend server'){
      steps{
        sh """
          cd servers/backend-server/
          docker build -t backend .
          docker images | grep end
          docker rmi backend
        """
      }
    }
  }
}
