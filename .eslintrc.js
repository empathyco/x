module.exports = {
  extends: ['plugin:@empathyco/x/recommended'],
  ignorePatterns: [
    '**/*.d.ts',
    '**/*.js',
    '**/jest.setup.ts',
    '**/dist',
    'packages/search-adapter'
  ],
  parserOptions: {
    project: './packages/**/tsconfig.eslint.json'
  },
  settings: {
    'import/resolver': {
      project: './packages/**/tsconfig.eslint.json'
    }
  }
};
