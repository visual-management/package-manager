#!/usr/bin/env node

const SemVer = require('semver').SemVer,
  nodeVersion = new SemVer(process.version),
  program = require('../vendors/program'),
  logger = require('../vendors/logger'),
  { commands } = require('../lib/options/vism'),
  pkg = require('../package.json');

if (nodeVersion.compare(new SemVer('6.9.0')) < 0) {
  logger.error(`ERROR: Your running version of Node v${nodeVersion.version}, is not a supported version to use the CLI. The official Node supported version is 6.9 and greater.`);

  process.exit(1);
}

program
  .version(pkg.version)
  .commandsList(commands)
  .parse(process.argv);
