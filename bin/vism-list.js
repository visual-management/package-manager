const program = require('commander'),

  pkg = require('../package.json'),
  CLI = require('../lib/cli'),
  List = require('../lib/commands/list');

program
  .version(pkg.version)
  .parse(process.argv);

const list = new List({});

list.getPlugins()
  .then((plugins) => {
    console.log(list.columnify(plugins)); // eslint-disable-line no-console
  })
  .catch((err) => CLI.exitOnError(err));
