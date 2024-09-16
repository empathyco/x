module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  ignorePatterns: ['cypress.config.ts'],
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
        'max-len': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        'vue/one-component-per-file': 'off'
      }
    }
  ]
};
