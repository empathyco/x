module.exports = {
  root: true,
  extends: ['plugin:@empathy/x/standard', 'plugin:react/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-extra-parens': 'off'
  }
};
