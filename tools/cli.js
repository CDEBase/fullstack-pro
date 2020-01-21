// require('babel-register')({ presets: ['env'], plugins: ['transform-class-properties'] });
// require('babel-polyfill');
const prog = require('caporal');


const addModuleCommand = require('./cli/commands/add-module');
const deleteModuleCommand = require('./cli/commands/delete-module');
const CommandInvoker = require('./cli/command-invoker');

const commandInvoker = new CommandInvoker(addModuleCommand, deleteModuleCommand);

prog
  .version('1.0.0')
  .description('Full info: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Apollo-Starter-Kit-CLI')
  // Add module
  .command('addmodule', 'Create a new Module.')
  .argument('<moduleName>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, browser]',
    ['both', 'server', 'browser'],
    'both'
  )
  .action((args, options, logger) => commandInvoker.runAddModule(args, options, logger))
  // Delete module
  .command('deletemodule', 'Delete a Module')
  .argument('<moduleName>', 'Module name')
  .argument('[location]', 'Where should we delete module. [both, server, browser]', ['both', 'server', 'browser'], 'both')
  .action((args, options, logger) => commandInvoker.runDeleteModule(args, options, logger));

prog.parse(process.argv);