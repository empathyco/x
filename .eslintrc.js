module.exports = {
  root: true,
  extends: ['plugin:@empathyco/x/recommended'],
  ignorePatterns: [
    '**/*.d.ts',
    '**/*.js',
    '**/jest.setup.ts',
    '**/dist',
    'packages/search-adapter',
    'packages/eslint-plugin-x',
    'packages/x-components/src/components/__tests__/snippet-callbacks.spec.ts'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './packages/**/tsconfig.eslint.json'
  }
};
