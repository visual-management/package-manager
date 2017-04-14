const glob = require('glob'),
  fs = require('fs');

class List {

  constructor (options) {
    this.options = options;
  }

  show (plugins) {
    plugins.forEach((plugin) => {
      console.log(plugin);
    });
  }

  getPlugins () {
    let entryPoint = fs.readFileSync('./plugins/sonar-plugin/entry-point.js', 'utf8'),
      match = entryPoint.match(List.ENTRY_POINT_NAME);

    console.log(match[1]);

    return Promise.resolve();
  }

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
}

List.ENTRY_POINTS_PATTERN = 'plugins/**/entry-point.js';
List.ENTRY_POINT_NAME = /name[ ]*: ['"]([a-zA-Z0-9_ ]+?)['"],/;

module.exports = List;
