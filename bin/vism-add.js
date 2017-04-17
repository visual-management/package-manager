const program = require('commander'),
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
    CLI.exitIfNotVisualManagementProject();

    if (id === undefined) {
      CLI.exitOnError(`Please provide the ${chalk.green('id')} of the new plugin. See ${chalk.green('vism help add')} for more details.`);
    }

  })
  .catch((err) => CLI.exitOnError(err));
