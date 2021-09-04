const path = require('path');

module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.eslint.json')
  },
  rules: {
    'no-dupe-class-members': 'off'
  }
};
