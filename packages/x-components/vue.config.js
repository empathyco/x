const glob = require('glob');

module.exports = {
  configureWebpack: {
    entry: ['./src/main.ts', ...glob.sync('src/styles/**/*.scss').map(style => `./${style}`)]
  }
};
