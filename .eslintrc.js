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
    project: './packages/**/tsconfig.eslint.json'
  }
};
