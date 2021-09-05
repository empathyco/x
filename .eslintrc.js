const glob = require('glob');

module.exports = {
  extends: ['plugin:@empathyco/x/recommended'],
  ignorePatterns: [
    '**/*.d.ts',
    '**/*.js',
    '**/.eslintrc.js',
    'dist',
    '**/jest.setup.ts',
    'packages/search-adapter'
  ],
  parserOptions: {
    project: glob.sync('./packages/*/tsconfig.eslint.json')
  }
};
