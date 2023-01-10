module.exports = {
  extends: ['plugin:react/recommended'],
  ignorePatterns: ['cypress.config.ts'],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  }
};
