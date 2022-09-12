const glob = require('glob');

module.exports = {
  configureWebpack: {
    entry: [...glob.sync('src/design-system/**/*.scss').map(style => `./${style}`), './src/main.ts']
  }
};
