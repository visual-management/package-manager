const program = require('commander'),
  chalk = require('chalk'),
  debug = require('debug')('vism-remove'),

  pkg = require('../package.json'),
  logger = require('../vendors/logger'),
  CLI = require('../lib/cli'),
  Remove = require('../lib/commands/remove'),
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
    cli.exitIfNotVisualManagementProject('remove');

    if (id === undefined) {
      CLI.exitOnError(`Please provide the ${chalk.green('id')} of the plugin to be removed. See ${chalk.green('vism help add')} for more details.`);
    }

    const remove = new Remove(id, {});

    return remove.start();
  })
  .then(() => {
    logger.pop(`${chalk.green('success')} Removed "${id}" plugin.`);
  })
  .catch((err) => {
    debug(err);

    CLI.exitOnError(err);
  });
