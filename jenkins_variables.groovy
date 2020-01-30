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

def getSecrets(json_file_path, env, var){
  def inputFile = new File(json_file_path)
  def InputJSON = new JsonSlurper().parse(inputFile)
  def secret = InputJSON."${env}"."${var}"
return secret
}
