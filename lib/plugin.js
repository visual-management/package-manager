const glob = require('glob'),
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),

  DynamicPathParser = require('./utilities/dynamic-path-parser'),
  logger = require('../vendors/logger');

class Plugin {

  static list () {
    return Plugin._getEntryPoints()
      .then((entryPoints) => Plugin._getInfo(entryPoints));
  }

  /**
   * Check whether the plugin exists or not
   *
   * @param   {string}            id  Plugin ID
   * @returns {Promise<boolean>}      TRUE if it does, FALSE otherwise
   */
  static exists (id) {
    return Plugin.list()
      .then((plugins) => plugins.find((plugin) => plugin.id === id) !== undefined);
  }

  /**
   * Retrieve a plugin by it's id
   *
   * @param   {string}    id  Plugin ID
   * @returns {Promise}
   */
  static get (id) {
    return Plugin.list()
      .then((plugins) => plugins.find((plugin) => plugin.id === id));
  }

  /**
   * Create the installation folder if it doesn't exists
   *
   * @param {CLI} cli
   */
  static createPluginsFolder (cli) {
    const installPath = path.join(cli.root, cli.vm.install),
      relativePath = DynamicPathParser.relative(cli.root, cli.vm.install);

    if (!fs.existsSync(installPath)) {
      fs.mkdirSync(installPath);

      logger.pop(`${chalk.green('create')} Plugins folder "${relativePath}"`);
    }
  }

  /**
   * Retrieve each plugin entry point
   *
   * @private
   * @returns {Promise<Array<string>>}
   */
  static _getEntryPoints () {
    return new Promise((resolve, reject) => {
      glob(Plugin.ENTRY_POINTS_PATTERN, (err, entryPoints) => {
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
  static _getInfo (entryPoints) {
    return new Promise ((resolve, reject) => {
      resolve(entryPoints.map((entryPoint) => {
        const content = fs.readFileSync(entryPoint, 'utf8');
        let res = {
          path: path.dirname(entryPoint)
        };

        Plugin.ENTRY_POINT_PROPS.forEach((prop) => {
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

Plugin.ENTRY_POINTS_PATTERN = path.join(__dirname, '..', 'plugins/**/entry-point.js');
Plugin.ENTRY_POINT_PROPS = [
  {
    name: 'id',
    regexp: /id[ ]*: [`'"]([a-zA-Z0-9_\- ]+?)[`'"],/
  },
  {
    name: 'version',
    regexp: /version[ ]*: [`'"]([a-zA-Z0-9_\-\. ]+?)[`'"],/
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

module.exports = Plugin;
