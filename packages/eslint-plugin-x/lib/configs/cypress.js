// https://github.com/cypress-io/eslint-plugin-cypress

module.exports = {
  cypress: {
    overrides: {
      files: ['tests/**/*.spec.{ts,tsx,js,jsx}'],
      plugins: ['cypress'],
      extends: ['plugin:cypress/recommended'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        'cypress/assertion-before-screenshot': 'error'
      }
    }
  }
};
