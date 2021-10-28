module.exports = {
  root: true,
  extends: ['plugin:@empathyco/x/standard', 'plugin:react/recommended'],
  ignorePatterns: ['**/*.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json'
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    },
    'import/resolver': {
      typescript: { project: './tsconfig.eslint.json' }
    }
  },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-extra-parens': 'off'
  }
};
