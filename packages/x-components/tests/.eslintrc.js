module.exports = {
  parserOptions: {
    project: './tests/tsconfig.eslint.json' // required for rules that need type information
  },
  extends: ['plugin:cypress/recommended', 'plugin:chai-friendly/recommended'],
  rules: {
    // https://github.com/cypress-io/eslint-plugin-cypress
    '@typescript-eslint/no-unused-expressions': 'off',
    'cypress/assertion-before-screenshot': 'error'
  }
};
