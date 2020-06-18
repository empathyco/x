// https://github.com/jest-community/eslint-plugin-jest

const jestConfigs = require('eslint-plugin-jest').configs;

module.exports = {
  jest: {
    overrides: {
      files: ['**/*.spec.{ts,tsx,js,jsx}'],
      excludedFiles: ['**/e2e/**/*'],
      env: { jest: true },
      plugins: ['jest'],
      rules: {
        /* ESLint configuration doesn't support extends block inside overrides for specific
        files. It is a hack to allow it. */
        ...jestConfigs.recommended.rules,
        ...jestConfigs.style.rules,
        'jest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
        'jest/lowercase-name': ['error', { ignore: ['test'] }],
        'jest/no-alias-methods': 'error',
        'jest/no-commented-out-tests': 'error',
        'jest/no-disabled-tests': 'error',
        'jest/no-duplicate-hooks': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-test-return-statement': 'error',
        'jest/prefer-hooks-on-top': 'error',
        'jest/require-top-level-describe': 'error',
        'jest/valid-title': 'error',
        'jsdoc/require-jsdoc': 'off'
      }
    }
  }
};



