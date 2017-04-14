const program = require('commander'),
  debug = require('debug')('vism-list'),

  pkg = require('../package.json'),
  CLI = require('../lib/cli'),
  List = require('../lib/commands/list');

program
  .version(pkg.version)
  .parse(process.argv);

const list = new List({});

list.getPlugins()
  .then((plugins) => list.show(plugins))
  .catch((err) => CLI.exitOnError(err));
