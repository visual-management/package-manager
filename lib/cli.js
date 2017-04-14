const findup = require('findup'),
  fs = require('fs'),

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
      if (fs.existsSync(`${this.root}/${CLI.CONFIG}`)) {
        this.vm = JSON.parse(fs.readFileSync(`${this.root}/${CLI.CONFIG}`, 'utf8'));
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
    return fs.existsSync(`${this.root}/${CLI.CONFIG}`);
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
