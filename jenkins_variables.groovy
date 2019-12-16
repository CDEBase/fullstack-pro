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


// Variables for package name and versions
env.FRONTEND_PACKAGE_NAME = getName("./servers/frontend-server/package.json")
env.FRONTEND_PACKAGE_VERSION = getVersion("./servers/frontend-server/package.json")
env.BACKEND_PACKAGE_NAME = getName("./servers/backend-server/package.json")
env.BACKEND_PACKAGE_VERSION = getVersion("./servers/backend-server/package.json")
env.HEMERA_PACKAGE_NAME = getName("./servers/hemera-server/package.json")
env.HEMERA_PACKAGE_VERSION = getVersion("./servers/hemera-server/package.json")
