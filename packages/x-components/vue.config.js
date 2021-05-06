const glob = require('glob');

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import '${glob.sync('src/styles/**/*.scss').join(`'; @import '`)}';`
      }
    }
  }
};
