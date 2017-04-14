const program = require('commander'),
  debug = require('debug')('vism-add'),
  chalk = require('chalk'),

  pkg = require('../package.json'),
  logger = require('../vendors/logger'),
  CLI = require('../lib/cli'),
  cli = CLI.getInstance();

let id;

program
  .version(pkg.version)
  .arguments('[id]')
  .action((idValue) => {
    id = idValue;
  })
  .on('--help', () => {
    logger.help('  Arguments:');
    logger.help('');
    logger.help(`    [id]           plugin's id, can be found using the ${chalk.blue('vism list')} command`);
  })
  .parse(process.argv);

cli.init()
  .then(() => {
    if (!cli.isVisualManagementProject()) {
      CLI.exitOnError(`You have to be inside a Visual Management project in order to use the ${chalk.green('add')} command.`);
    }

    if (id === undefined) {
      CLI.exitOnError(`Please provide the ${chalk.green('id')} of the new plugin. See ${chalk.green('vism help add')} for more details.`);
    }

  })
  .catch((err) => CLI.exitOnError(err));
