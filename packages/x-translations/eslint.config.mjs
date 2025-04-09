import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    rules: {
      'jsdoc/check-param-names': 'off',
    },
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'ts/no-require-imports': 'off',
    },
  },
)
