// https://eslint.org/docs/rules/

module.exports = {
  eslint: {
    extends: ['eslint:recommended'],
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      indent: 'off',
      'max-len': ['error', { code: 100, ignoreComments: false }],
      'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-dupe-class-members': 'off',
      'no-duplicate-imports': 'error',
      'no-empty-function': 'off',
      'no-eval': 'error',
      'no-extra-parens': 'off',
      'no-restricted-imports': ['error', { patterns: ['rxjs/internal/**/*', '**/dist/**/*'] }],
      'no-template-curly-in-string': 'error',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'require-atomic-updates': 'error',
      'require-await': 'error',
      strict: ['error', 'global']
    }
  }
};
