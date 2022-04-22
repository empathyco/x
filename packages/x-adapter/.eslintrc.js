module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
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
    }
  ]
};
