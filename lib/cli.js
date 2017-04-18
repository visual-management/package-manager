const findup = require('findup'),
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),

  logger = require('../vendors/logger');

class CLI {

  /**
   * Returns the CLI instance
   *
   * @returns {CLI}
   */
  static getInstance () {
    if (this.instance === undefined || this.instance === null) {
      this.instance = new CLI();
    }

    return this.instance;
  }

  init () {
    return this._closestPackageJSON().then(() => {
      if (fs.existsSync(path.join(this.root, CLI.CONFIG))) {
        this.vm = JSON.parse(fs.readFileSync(path.join(this.root, CLI.CONFIG), 'utf8'));
      }

      return true;
    });
  }

  /**
   * Returns whether or not we are inside a Visual Management project.
   * This checks whether `.visual-management.json` exists in the project.
   *
   * @return {boolean} TRUE if it is; FALSE otherwise
   */
  isVisualManagementProject () {
    return fs.existsSync(path.join(this.root, CLI.CONFIG));
  }

  /**
   * Check whether the plugin exists in the manifest file or not
   *
   * @param   {string}    plugin  Plugin ID
   * @returns {boolean}           TRUE if it exists; FALSE otherwise
   */
  pluginExistsInManifest (plugin) {
    return this.vm.plugins !== undefined && this.vm.plugins[plugin] !== undefined;
  }

  /**
   * Exit CLI if we are not inside a Visual Management project
   *
   * @param {string}  command   Launched command (will print a personalized error message)
   */
  exitIfNotVisualManagementProject (command) {
    if (!this.isVisualManagementProject()) {
      CLI.exitOnError(`You have to be inside a Visual Management project in order to use the ${chalk.green(command)} command.`);
    }
  }

  /**
   * Returns the closest package.json file (going up in folders)
   *
   * @private
   * @returns {Promise}
   */
  _closestPackageJSON () {
    return new Promise ((resolve, reject) => {
      findup(process.cwd(), 'package.json', (err, dir) => {
        if (err) {
          reject (err);
        }

        if (dir !== undefined) {
          this.root = dir;
          this.pkg = JSON.parse(fs.readFileSync(`${dir}/package.json`, 'utf8'));
        }

        resolve();
      });
    });
  }

  /**
   * Exit app with the given error message and code
   *
   * @param {string}  message
   * @param {number}  code
   */
  static exitOnError (message, code = 1) {
    logger.error(message);

    process.exit(code);
  }

}

CLI.CONFIG = '.visual-management.json';

module.exports = CLI;
