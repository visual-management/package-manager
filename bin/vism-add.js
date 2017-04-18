const program = require('commander'),
  chalk = require('chalk'),
  debug = require('debug')('vism-add'),

  pkg = require('../package.json'),
  logger = require('../vendors/logger'),
  CLI = require('../lib/cli'),
  Plugin = require('../lib/plugin'),
  Add = require('../lib/commands/add'),
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
    cli.exitIfNotVisualManagementProject('add');

    if (id === undefined) {
      CLI.exitOnError(`Please provide the ${chalk.green('id')} of the new plugin. See ${chalk.green('vism help add')} for more details.`);
    }

    // Create installation folder if not exists
    Plugin.createPluginsFolder(cli);

    const add = new Add(id, {});

    return add.start();
  })
  .then(() => {
    logger.pop(`${chalk.green('success')} Installed "${id}" plugin.`);
  })
  .catch((err) => {
    debug(err);

    CLI.exitOnError(err);
  });
