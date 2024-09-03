module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  // TODO - Reactivate linter for unit and e2e tests once they pass.
  ignorePatterns: [
    'cypress.config.ts',
    '**/__tests__/**/*.spec.ts',
    '**/tests/**/*.spec.ts',
    '**/__tests__/**/utils.ts',
    '**/tests/**/utils.ts'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  rules: {
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-for-template-key': 'off'
  },
  overrides: [
    {
      files: 'src/**/*.vue',
      rules: {
        'max-len': [
          'error',
          {
            code: 100,
            ignoreComments: false,
            ignorePattern: '|class=".*"$ |https://github'
          }
        ]
      }
    },
    {
      files: 'src/components/icons/*.vue',
      rules: {
        'max-len': 'off'
      }
    },
    {
      files: ['*.spec.ts'],
      rules: {
        'max-len': 'off'
      }
    }
  ]
};
