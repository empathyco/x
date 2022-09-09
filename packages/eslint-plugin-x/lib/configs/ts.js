// https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

const syntaxRules = {
  '@typescript-eslint/ban-types': 'error',
  '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    { overrides: { methods: 'no-public', properties: 'explicit' } }
  ],
  // TODO - Activate rule when the bug is fixed
  // https://github.com/typescript-eslint/typescript-eslint/issues/2183
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/no-empty-function': ['error', { allow: ['protected-constructors'] }],
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-extra-parens': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unused-expressions': ['error'],
  '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
  '@typescript-eslint/prefer-optional-chain': 'error'
};

const typeRules = {
  '@typescript-eslint/no-floating-promises': 'off', // TODO - Consider to enable
  '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'off', // TODO - Consider to enable
  '@typescript-eslint/no-unsafe-member-access': 'off', // TODO - Consider to enable
  '@typescript-eslint/no-unsafe-return': 'off', // TODO - Consider to enable
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/restrict-template-expressions': 'error',
  '@typescript-eslint/no-unsafe-argument': 'warn'
};

module.exports = {
  ts: {
    parserOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: { sourceType: 'module' },
      project: './tsconfig.eslint.json', // required for rules that need type information
      extraFileExtensions: ['.vue']
    },
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    rules: {
      ...syntaxRules,
      ...typeRules
    }
  }
};
