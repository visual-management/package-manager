const { Command } = require('commander');

/**
 * Add a list of commands
 *
 * @param   {Array<{name: string, description: string, default?: string}>}   commands
 * @returns {Command}
 */
Command.prototype.commandsList = function (commands) {
  const self = this;

  commands.forEach((command) => {
    self.command(command.name, command.description, command.default);
  });

  return self;
};

module.exports = new Command();
