const program = require('commander'),
  debug = require('debug')('vism-list'),

  pkg = require('../package.json'),
  CLI = require('../lib/cli'),
  Plugin = require('../lib/plugin'),
  List = require('../lib/commands/list');

program
  .version(pkg.version)
  .parse(process.argv);

const list = new List({});

Plugin.list()
  .then((plugins) => {
    console.log(list.columnify(plugins)); // eslint-disable-line no-console
  })
  .catch((err) => {
    debug(err);

    CLI.exitOnError(err);
  });
