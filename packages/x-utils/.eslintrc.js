module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  overrides: [
    {
      files: ['src/**/__tests__/*.types.spec.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-expect-error': false
          }
        ]
      }
    },
    {
      files: ['src/**/__tests__/*.spec.ts'],
      rules: {
        'jsdoc/require-description': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-returns': 'off',
        'tsdoc/syntax': 'off'
      }
    }
  ]
};
