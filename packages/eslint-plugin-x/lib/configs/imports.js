// https://github.com/benmosher/eslint-plugin-import

module.exports = {
  imports: {
    extends: ['plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
    rules: {
      'import/no-self-import': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './',
              from: './types'
            }
          ]
        }
      ],
      'import/order': 'error'
    },
    settings: {
      'import/resolver': {
        typescript: {} // this loads <rootdir>/tsconfig.json to eslint
      }
    }
  }
};
