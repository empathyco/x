module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  rules: {
    'max-len': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'vue/no-multiple-template-root': 'off'
  }
};
