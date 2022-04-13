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
    }
  ]
};
