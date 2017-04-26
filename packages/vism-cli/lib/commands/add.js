const chalk = require('chalk'),
  path = require('path'),
  fs = require('fs-extra'),
  got = require('got'),
  denodeify = require('denodeify'),
  spawn = denodeify(require('child_process').spawn),

  Plugin = require('../plugin'),
  PluginUtils = require('../utilities/plugin.utils'),
  DynamicPathParser = require('../utilities/dynamic-path-parser'),
  logger = require('../../vendors/logger'),
  CLI = require('../cli'),
  cli = CLI.getInstance();

class Add {

  constructor (plugin, options) {
    this.plugin = plugin;
    this.options = options;

    this.cli = cli;
    this.logger = logger;
  }

  start () {
    if (!this.plugin.startsWith('@visual-management/')) {
      return Promise.reject(`Plugin name must start with ${chalk.green('@visual-management/')}`);
    }

    return this.installPlugin()
      .writeToReferenceFile();
  }

  installPlugin () {
    this._log(`[1/2] Installing plugin with NPM`);

    return got(`https://www.npmjs.com/package/${this.plugin}`)
      .then(() => spawn('npm', [ 'install', this.plugin, '--save' ], {
        stdio: 'pipe',
        cwd  : cli.root,
        shell: true
      }))
      .catch(() => Promise.reject(`Plugin ${chalk.green(this.plugin)} doesn't exists. See plugins list.`));
  }

  writeToReferenceFile (plugin) {
    return new Promise((resolve) => {
      const referenceFilePath = path.join(this.cli.root, this.cli.vm.reference),
        pluginsPath = path.join(this.cli.root, this.cli.vm.install),
        entryPointPath = path.join(pluginsPath, plugin.id, 'entry-point'),
        importPath = DynamicPathParser.relative(path.dirname(referenceFilePath), entryPointPath);

      this._log(`[2/2] Adding plugin to reference file`);

      let referenceFile = fs.readFileSync(referenceFilePath, 'utf8');

      referenceFile = PluginUtils.addImport(referenceFile, this.classifiedName, importPath);
      referenceFile = PluginUtils.addToPluginsArray(referenceFile, this.classifiedName);

      fs.writeFileSync(referenceFilePath, referenceFile);

      resolve();
    });
  }

  _log (message, type = 'pop') {
    if (!this.options.quiet) {
      switch (type) {
        case 'pop':
        default:
          this.logger.pop(message);
          break;
      }
    }
  }

}

module.exports = Add;
