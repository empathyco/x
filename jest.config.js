const glob = require('glob');
const base = require('./jest-base.config');

module.exports = {
  ...base,
  projects: glob.sync('packages/*/jest.config.js')
};
