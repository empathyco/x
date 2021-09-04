const path = require('path');

module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  project: {
    parserOptions: path.resolve(__dirname, 'tsconfig.eslint.json')
  },
  rules: {
    'no-dupe-class-members': 'off'
  }
};
