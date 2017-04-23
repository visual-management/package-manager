const chalk = require('chalk'),
  path = require('path'),
  fs = require('fs-extra'),
  got = require('got'),
  denodeify = require('denodeify'),
  spawn = denodeify(require('child_process').spawn),

  Plugin = require('../plugin'),
  PluginUtils = require('../utilities/plugin.utils'),
  StringUtils = require('../utilities/string.utils'),
  DynamicPathParser = require('../utilities/dynamic-path-parser'),
  logger = require('../../vendors/logger'),
  CLI = require('../cli'),
  cli = CLI.getInstance();

class Add {

  constructor (plugin, options) {
    this.plugin = plugin;
    // this.classifiedName = StringUtils.classify(id);
    this.options = options;

    this.cli = cli;
    this.logger = logger;
  }

  start () {
    // this.copyPlugin(plugin);
    return this.installPlugin();
    // this.writeToManifestFile(plugin);
    // this.writeToReferenceFile(plugin);
  }

  // start () {
  //   return Plugin.get(this.id).then((plugin) => {
  //     if (plugin === undefined) {
  //       return Promise.reject(`Plugin of id ${chalk.green(this.id)} doesn't exists. Use the ${chalk.green('list')} command to see available plugins.`);
  //     }
  //
  //     this.parsedPath = path.parse(plugin.path);
  //
  //     // this.copyPlugin(plugin);
  //     this.installPlugin(plugin);
  //     // this.writeToManifestFile(plugin);
  //     this.writeToReferenceFile(plugin);
  //   });
  // }

  copyPlugin (plugin) {
    const outputPath = path.join(cli.vm.install, this.parsedPath.name);

    this._log(`[1/3] Copying plugin to installation folder`);

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.copySync(plugin.path, outputPath);
  }

  installPlugin (plugin) {
    this._log(`[1/2] Installing plugin with NPM`);

    return got(`https://www.npmjs.com/package/${this.plugin}`)
      .then(() => spawn('npm', [ 'install' ], {
        stdio: 'pipe',
        cwd  : cli.root,
        shell: true
      }))
      .catch(() => Promise.reject(`Plugin ${chalk.green(this.plugin)} doesn't exists. See plugins list.`));
  }

  writeToManifestFile (plugin) {
    const vm = this.cli.vm;

    this._log(`[2/3] Adding plugin to manifest`);

    vm.plugins = (vm.plugins === undefined) ? {} : vm.plugins;
    vm.plugins[plugin.id] = plugin.version;

    fs.writeFileSync(path.join(this.cli.root, CLI.CONFIG), JSON.stringify(vm, null, 2), 'utf8');
  }

  writeToReferenceFile (plugin) {
    const referenceFilePath = path.join(this.cli.root, this.cli.vm.reference),
      pluginsPath = path.join(this.cli.root, this.cli.vm.install),
      entryPointPath = path.join(pluginsPath, plugin.id, 'entry-point'),
      importPath = DynamicPathParser.relative(path.dirname(referenceFilePath), entryPointPath);

    this._log(`[2/2] Adding plugin to reference file`);

    let referenceFile = fs.readFileSync(referenceFilePath, 'utf8');

    referenceFile = PluginUtils.addImport(referenceFile, this.classifiedName, importPath);
    referenceFile = PluginUtils.addToPluginsArray(referenceFile, this.classifiedName);

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

module.exports = Add;
