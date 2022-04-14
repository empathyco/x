module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  overrides: [
    {
      files: ['src/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off'
      }
    }
  ]
};
