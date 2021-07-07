const glob = require('glob');

module.exports = {
  configureWebpack: {
    entry: ['./src/main.ts', ...glob.sync('src/design-system/**/*.scss').map(style => `./${style}`)]
  }
};
