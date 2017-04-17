const glob = require('glob'),
  fs = require('fs'),
  chalk = require('chalk'),
  columnify = require('columnify');

class List {

  constructor (options) {
    this.options = options;
  }

  getPlugins () {
    return this._getEntryPoints()
      .then((entryPoints) => this._getInfo(entryPoints));
  }

  columnify (plugins) {
    return columnify(plugins.map((plugin) => {
      plugin.id = chalk.blue(plugin.id);

      return plugin;
    }), {
      minWidth: 20
    });
  }

  /**
   * Retrieve each plugin entry point
   *
   * @private
   * @returns {Promise<Array<string>>}
   */
  _getEntryPoints () {
    return new Promise((resolve, reject) => {
      glob(List.ENTRY_POINTS_PATTERN, (err, entryPoints) => {
        if (err) {
          reject(err);
        }

        resolve(entryPoints);
      });
    });
  }

  /**
   * Extract information from each entry point
   *
   * @private
   * @param   {Array<string>}           entryPoints
   * @returns {Promise<Array<Object>>}
   */
  _getInfo (entryPoints) {
    return new Promise ((resolve, reject) => {
      resolve(entryPoints.map((entryPoint) => {
        const content = fs.readFileSync(entryPoint, 'utf8');
        let res = {};

        List.ENTRY_POINT_PROPS.forEach((prop) => {
          const match = content.match(prop.regexp);

          if (match === null) {
            reject(`Unable to find '${entryPoint}' entry point's ${prop.name}`);
          }

          res[prop.name] = match[1];
        });

        return res;
      }));
    });
  }

}

List.ENTRY_POINTS_PATTERN = 'plugins/**/entry-point.js';
List.ENTRY_POINT_PROPS = [
  {
    name: 'id',
    regexp: /id[ ]*: [`'"]([a-zA-Z0-9_\- ]+?)[`'"],/
  },
  {
    name: 'name',
    regexp: /name[ ]*: [`'"]([a-zA-Z0-9_\- ]+?)[`'"],/
  },
  {
    name: 'description',
    regexp: /description[ ]*: [`'"]([a-zA-Z0-9_\- ]+?)[`'"],/
  }
];

module.exports = List;
