module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  rules: {
    'max-len': 'off'
  }
};
