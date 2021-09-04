const glob = require('glob');

module.exports = {
  extends: ['plugin:@empathyco/x/recommended'],
  parserOptions: {
    project: glob.sync('./packages/*/tsconfig.eslint.json')
  }
};
