module.exports = {
  root: true,
  extends: ['plugin:@empathyco/x/recommended', 'plugin:vuejs-accessibility/recommended'],
  ignorePatterns: [
    '**/*.d.ts',
    '**/*.js',
    '**/jest.setup.ts',
    '**/dist',
    'packages/search-adapter',
    'packages/eslint-plugin-x'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './packages/**/tsconfig.eslint.json'
  }
};
