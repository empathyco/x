module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  ignorePatterns: ['cypress.config.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  rules: {
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-unused-vars-experimental': 'off'
  }
};
