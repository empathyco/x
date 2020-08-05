const path = require('path');

module.exports = {
  plugins: ['cypress'],
  env: {
    mocha: true,
    'cypress/globals': true
  },
  rules: {
    strict: 'off'
  },
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json')
  }
};
