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
    'vue/require-default-prop': 'off'
  },
  overrides: [
    {
      files: ['src/**/*.vue'],
      rules: {
        /*
         * We disable "max-len" rule to ".vue" files because it has some limitations
         * https://github.com/vuejs/vue-eslint-parser#%EF%B8%8F-known-limitations.
         */
        'max-len': 'off'
      }
    }
  ]
};
