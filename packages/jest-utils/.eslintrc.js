module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  rules: {
    '@typescript-eslint/restrict-template-expressions': ['off', { allowAny: true }],
    '@typescript-eslint/no-namespace': ['off']
  }
};
