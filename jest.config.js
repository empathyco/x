const glob = require('glob');
module.exports = {
  projects: glob.sync('packages/*/jest.config.js')
};
