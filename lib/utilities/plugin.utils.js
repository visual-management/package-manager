const os = require('os');

class PluginUtils {

  /**
   * Add an 'import' declaration to the file
   *
   * ```javascript
   * // import name from 'importPath';
   * import Plugin from '../plugins/plugin/entry-point';
   * ```
   *
   * @param {string}  file        File content
   * @param {string}  name        Import name
   * @param {string}  importPath  Path to the entity to import (relative to the file path)
   */
  static addImport (file, name, importPath) {
    let importPart = `import ${name} from '${importPath}';`,
      match = file.match(PluginUtils.ADD_IMPORT_REGEXP);

    // Do nothing if the import is already present
    if (file.includes(name)) {
      return file;
    }

    // If no import's were found, this might be the first plugin
    // So let's add it on top on the file
    if (match === undefined || match === null) {
      return `${importPart}${os.EOL}${os.EOL}${file}`;
    }

    return `${match[1]}${match[2]}${os.EOL}${importPart}${match[3]}`;
  }

  /**
   * Add the new plugin into it's array
   *
   * ```javascript
   * export const Plugins = [
   *   'PluginName'
   * ];
   * ```
   *
   * @param {string}  file    File content
   * @param {string}  name    Import name
   */
  static addToPluginsArray (file, name) {
    let match = PluginUtils._matchPluginsArray(file),
      plugins = match[2];

    if (!plugins.includes(name)) {
      plugins.push(name);
    }

    return `${match[1]}${PluginUtils._stringifyPluginsArray(plugins)}${match[3]}`;
  }

  static removeImport (file, name) {
    const removeRegexp = new RegExp('import ' + name + ' from \'.*?\';[\r?\n|\r]');

    return file.replace(removeRegexp, '');
  }

  static removeFromPluginsArray (file, name) {
    let match = PluginUtils._matchPluginsArray(file),
      plugins = match[2];

    plugins = plugins.filter((plugin) => plugin !== name);

    return `${match[1]}${PluginUtils._stringifyPluginsArray(plugins)}${match[3]}`;
  }

  static _matchPluginsArray (file) {
    let match = file.match(PluginUtils.ADD_ARRAY_REGEXP);

    if (match === undefined || match === null) {
      throw new Error(`Unable to retrieve the plugins array, the file must be misformatted`);
    }

    match[ 2 ] = match[ 2 ]
      .split(',')
      .map((plugin) => plugin.trim())
      .filter((plugin) => plugin !== '');

    return match;
  }

  static _stringifyPluginsArray (plugins) {
    return JSON.stringify(plugins, null, 2).replace(/"/g, '');
  }

}

PluginUtils.ADD_IMPORT_REGEXP = /^([\s\S]*)(import.*?;)([\s\S]*)$/;
PluginUtils.ADD_ARRAY_REGEXP = /^([\s\S]*Plugins = )\[([\s\S]*)\](;[\s\S]*)$/;
// PluginUtils.REMOVE_IMPORT_REGEXP = /^([\s\S]*)(import ${name} from '${importPath}';)([\s\S]*)$/;

module.exports = PluginUtils;
