const chalk = require('chalk'),
  path = require('path'),
  fs = require('fs-extra'),

  Plugin = require('../plugin'),
  PluginUtils = require('../utilities/plugin.utils'),
  StringUtils = require('../utilities/string.utils'),
  DynamicPathParser = require('../utilities/dynamic-path-parser'),
  CLI = require('../cli'),
  cli = CLI.getInstance();

class Add {

  constructor (id, options) {
    this.id = id;
    this.classifiedName = StringUtils.classify(id);
    this.cli = cli;
    this.options = options;
  }

  start () {
    return Plugin.get(this.id).then((plugin) => {
      if (plugin === undefined) {
        return Promise.reject(`Plugin of id ${chalk.green(this.id)} doesn't exists. Use the ${chalk.green('list')} command to see available plugins.`);
      }

      this.parsedPath = path.parse(plugin.path);

      this.copyPlugin(plugin);
      this.writeInVMFile(plugin);
      this.writeInReferenceFile(plugin);
    });
  }

  copyPlugin (plugin) {
    const outputPath = path.join(cli.vm.install, this.parsedPath.name);

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.copySync(plugin.path, outputPath);
  }

  writeInVMFile (plugin) {
    const vm = this.cli.vm;

    vm.plugins = (vm.plugins === undefined) ? {} : vm.plugins;
    vm.plugins[plugin.id] = plugin.version;

    fs.writeFileSync(path.join(this.cli.root, CLI.CONFIG), JSON.stringify(vm, null, 2), 'utf8');
  }

  writeInReferenceFile (plugin) {
    const referenceFilePath = path.join(this.cli.root, this.cli.vm.reference),
      entryPointPath = path.join(plugin.path, 'entry-point'),
      importPath = DynamicPathParser.relative(this.cli.root, entryPointPath);

    let referenceFile = fs.readFileSync(referenceFilePath, 'utf8');

    referenceFile = PluginUtils.addImport(referenceFile, this.classifiedName, importPath);
    referenceFile = PluginUtils.addInPluginsArray(referenceFile, this.classifiedName);

    fs.writeFileSync(referenceFilePath, referenceFile);
  }

}

module.exports = Add;
