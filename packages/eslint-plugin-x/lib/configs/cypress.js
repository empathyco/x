// https://github.com/cypress-io/eslint-plugin-cypress

module.exports = {
  cypress: {
    overrides: {
      files: ['**/e2e/**/*.spec.{ts,tsx,js,jsx}'],
      plugins: ['cypress'],
      rules: {
        /* ESLint configuration doesn't support extends block inside overrides for specific
        files. It is a hack to allow it. */
        ...require('eslint-plugin-cypress').configs.recommended.rules,
        '@typescript-eslint/no-unused-expressions': 'off',
        'cypress/assertion-before-screenshot': 'error'
      }
    }
  }
}
