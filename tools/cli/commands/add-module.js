const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { copyFiles, renameFiles, computeModulesPath, runPrettier } = require('../helpers/util');

/**
 * Adds application module to browser or server code and adds it to the module list.
 *
 * @param logger - The Logger.
 * @param templatesPath - The path to the templates for a new module.
 * @param moduleName - The name of a new module.
 * @param location - The location for a new module [browser|server|both].
 * @param finished - The flag about the end of the generating process.
 */
function addModule(logger, templatesPath, moduleName, location, finished = true) {
    logger.info(`Copying ${location} files…`);

    // create new module directory
    const destinationPath = computeModulesPath(location, moduleName);
    const newModule = shell.mkdir(destinationPath);

    // continue only if directory does not jet exist
    if (newModule.code !== 0) {
        console.log(newModule)
        logger.error(`creating destination '${destinationPath} failed.`)
        logger.error(chalk.red(`The ${moduleName} directory is already exists.`));
        process.exit();
    }
    //copy and rename templates in destination directory
    copyFiles(destinationPath, templatesPath, location);
    renameFiles(destinationPath, moduleName);

    logger.info(chalk.green(`✔ The ${location} files have been copied!`));

    // get index file path
    const modulesPath = computeModulesPath(location);
    const indexFullFileName = fs.readdirSync(modulesPath).find(name => name.search(/index/) >= 0);
    const indexPath = modulesPath + indexFullFileName;
    let indexContent;

    try {
        // prepend import module
        indexContent = `import ${moduleName} from './${moduleName}';\n` + fs.readFileSync(indexPath);
    } catch (e) {
        logger.error(chalk.red(`Failed to read ${indexPath} file`));
        process.exit();
    }

    // extract application modules
    const appModuleRegExp = /Module\(([^()]+)\)/g;
    const [, appModules] = appModuleRegExp.exec(indexContent) || ['', ''];

    // add module to app module list
    shell
        .ShellString(indexContent.replace(RegExp(appModuleRegExp, 'g'), `Module(${moduleName}, ${appModules})`))
        .to(indexPath);
    runPrettier(indexPath);

    if (finished) {
        logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
    }
}

module.exports = addModule;