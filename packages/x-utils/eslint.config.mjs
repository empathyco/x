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
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-return': 'off',
    },
  },
)
