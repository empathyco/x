const { execSync } = require('child_process');

module.exports.exec = function exec(command) {
  return execSync(command, { encoding: 'utf-8' });
}