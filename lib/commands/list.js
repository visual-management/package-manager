const chalk = require('chalk'),
  columnify = require('columnify');

class List {

  constructor (options) {
    this.options = options;
  }

  columnify (plugins) {
    return columnify(plugins.map((plugin) => {
      plugin.id = chalk.blue(plugin.id);

      return plugin;
    }), {
      columns: [ 'id', 'version', 'name', 'description' ],
      minWidth: 20
    });
  }

}

module.exports = List;
