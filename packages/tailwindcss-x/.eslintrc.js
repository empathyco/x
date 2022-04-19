module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  overrides: [
    {
      files: ['{src,demo}/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off'
      }
    }
  ]
};
