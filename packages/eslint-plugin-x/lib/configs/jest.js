// https://github.com/jest-community/eslint-plugin-jest

module.exports = {
  jest: {
    overrides: {
      files: ['src/**/*.spec.{ts,tsx,js,jsx}'],
      excludedFiles: ['tests/**/*'],
      env: { jest: true },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
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
