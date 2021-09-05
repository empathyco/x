const path = require('path');

module.exports = {
  extends: ['plugin:react/recommended'],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  },
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.eslint.json')
  }
};
