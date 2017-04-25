const rimraf = require('rimraf'),
  path = require('path'),
  fs = require('fs'),

  StringUtils = require('../utilities/string.utils'),
  PluginUtils = require('../utilities/plugin.utils'),
  logger = require('../../vendors/logger'),
  CLI = require('../cli'),
  cli = CLI.getInstance();

class Remove {

  constructor (id, options) {
    this.id = id;
    this.classifiedName = StringUtils.classify(id);
    this.options = options;

    this.cli = cli;
    this.logger = logger;
  }

  start () {
    if (!this.cli.pluginExistsInManifest(this.id)) {
      return Promise.reject(`This plugin isn't specified in the manifest file.`);
    }

    return this.removePlugin()
      .then(() => this.removeFromManifestFile())
      .then(() => this.removeFromReferenceFile());
  }

  removePlugin () {
    return new Promise ((resolve) => {
      this._log(`[1/3] Removing plugin from installation folder`);

      const pluginPath = path.join(this.cli.root, this.cli.vm.install, this.id);

      rimraf(pluginPath, () => resolve());
    });
  }

  removeFromManifestFile () {
    this._log(`[2/3] Removing plugin from manifest`);

    const vm = this.cli.vm;

    delete vm.plugins[this.id];

    fs.writeFileSync(path.join(this.cli.root, CLI.CONFIG), JSON.stringify(vm, null, 2), 'utf8');

    return Promise.resolve();
  }

  removeFromReferenceFile () {
    this._log(`[3/3] Removing plugin from reference file`);

    let referenceFilePath = path.join(this.cli.root, this.cli.vm.reference),
      referenceFile = fs.readFileSync(referenceFilePath, 'utf8');

    referenceFile = PluginUtils.removeImport(referenceFile, this.classifiedName);
    referenceFile = PluginUtils.removeFromPluginsArray(referenceFile, this.classifiedName);

    fs.writeFileSync(referenceFilePath, referenceFile);
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

module.exports = Remove;
