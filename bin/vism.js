#!/usr/bin/env node

const program = require('commander'),
  SemVer = require('semver').SemVer,
  nodeVersion = new SemVer(process.version),
  logger = require('../vendors/logger'),
  pkg = require('../package.json');

if (nodeVersion.compare(new SemVer('6.9.0')) < 0) {
  logger.error(`ERROR: Your running version of Node v${nodeVersion.version}, is not a supported version to use the CLI. The official Node supported version is 6.9 and greater.`);

  process.exit(1);
}

program
  .version(pkg.version)
  .command('add', 'add a new plugin to your visual management')
  .command('list', 'list available plugins')
  .parse(process.argv);
